"use server";

import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import type { DocumentReference } from "firebase-admin/firestore";

import { adminDB } from "@/firebase/admin-init";
import { getSessionUser } from "@/lib/auth/session";
import { getCourseNavigationData } from "@/actions/courses/read-courses";
import { sortOutlineElements } from "@/actions/courses/helpers";
import type { CourseProgressEntry } from "@/schemas/userSchema";

export type CourseProgressResult =
  | { success: true; entry: CourseProgressEntry }
  | { success: false; error: string };

export type UpdateProgressResult =
  { success: true } | { success: false; error: string };

const updateProgressInput = z.object({
  courseId: z.string().min(1),
  elementId: z.string().min(1),
});

const migrateProgressInput = z.object({
  courseId: z.string().min(1),
  elementsCompleted: z.array(z.string().min(1)),
  started: z.boolean().optional(),
  setAsCurrentCourse: z.boolean().optional(),
});

export async function getCourseProgress(
  courseId: string,
): Promise<CourseProgressResult> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return { success: false, error: "Unauthenticated" };
  }

  try {
    const userRef = adminDB.collection("users").doc(sessionUser.uid);
    const userDoc = await userRef.get();
    const data = userDoc.data();

    const rawEntry = data?.courseProgress?.[courseId] as
      Partial<CourseProgressEntry> | undefined;

    const entry: CourseProgressEntry = {
      elementsCompleted: rawEntry?.elementsCompleted ?? [],
      sectionsCompleted: rawEntry?.sectionsCompleted ?? [],
    };

    // Auto-unlock free courses on first access
    const unlockedCourses: string[] = data?.unlockedCourses ?? [];
    if (!unlockedCourses.includes(courseId)) {
      const navData = await getCourseNavigationData(courseId);
      if (navData?.course.price.isFree) {
        await userRef.update({
          unlockedCourses: FieldValue.arrayUnion(courseId),
          currentCourse: courseId,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    }

    return { success: true, entry };
  } catch (error) {
    console.error("getCourseProgress failed:", error);
    return { success: false, error: "Failed to fetch progress" };
  }
}

/**
 * Recomputes and persists section/course completion after elementsCompleted changes.
 * Reads the current Firestore state, so it's safe to call after any arrayUnion.
 */
async function recomputeCompletion(
  userRef: DocumentReference,
  courseId: string,
): Promise<void> {
  const [navData, userDoc] = await Promise.all([
    getCourseNavigationData(courseId),
    userRef.get(),
  ]);

  if (!navData) return;

  const data = userDoc.data();
  const rawEntry = data?.courseProgress?.[courseId] as
    Partial<CourseProgressEntry> | undefined;
  const nowCompleted = new Set<string>(rawEntry?.elementsCompleted ?? []);
  const sectionsAlreadyCompleted: string[] = rawEntry?.sectionsCompleted ?? [];

  const sectionUpdates: Record<string, unknown> = {};

  for (const section of navData.outline.sections) {
    if (sectionsAlreadyCompleted.includes(section.id)) continue;
    const allElementIds = sortOutlineElements(section.elements).map(
      (el) => el.id,
    );
    if (
      allElementIds.length > 0 &&
      allElementIds.every((id) => nowCompleted.has(id))
    ) {
      sectionUpdates[`courseProgress.${courseId}.sectionsCompleted`] =
        FieldValue.arrayUnion(section.id);
    }
  }

  const newlyCompletedSectionIds =
    Object.keys(sectionUpdates).length > 0
      ? navData.outline.sections
          .filter((s) => !sectionsAlreadyCompleted.includes(s.id))
          .filter((s) => {
            const allElementIds = sortOutlineElements(s.elements).map(
              (el) => el.id,
            );
            return (
              allElementIds.length > 0 &&
              allElementIds.every((id) => nowCompleted.has(id))
            );
          })
          .map((s) => s.id)
      : [];

  const allSectionIds = navData.outline.sections.map((s) => s.id);
  const sectionsAfterUpdate = [
    ...sectionsAlreadyCompleted,
    ...newlyCompletedSectionIds,
  ];
  const courseComplete = allSectionIds.every((id) =>
    sectionsAfterUpdate.includes(id),
  );

  if (Object.keys(sectionUpdates).length > 0 || courseComplete) {
    await userRef.update({
      ...sectionUpdates,
      ...(courseComplete
        ? { completedCourses: FieldValue.arrayUnion(courseId) }
        : {}),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
}

export async function updateCourseProgress(
  input: unknown,
): Promise<UpdateProgressResult> {
  const parsed = updateProgressInput.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }
  const { courseId, elementId } = parsed.data;

  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return { success: false, error: "Unauthenticated" };
  }

  try {
    const userRef = adminDB.collection("users").doc(sessionUser.uid);

    await userRef.update({
      [`courseProgress.${courseId}.elementsCompleted`]:
        FieldValue.arrayUnion(elementId),
      currentCourse: courseId,
      updatedAt: FieldValue.serverTimestamp(),
    });

    await recomputeCompletion(userRef, courseId);

    return { success: true };
  } catch (error) {
    console.error("updateCourseProgress failed:", error);
    return { success: false, error: "Failed to update progress" };
  }
}

/**
 * Merges guest localStorage progress into Firestore after the user logs in or registers.
 * Idempotent — uses arrayUnion so duplicate calls are safe.
 */
export async function migrateGuestProgress(
  input: unknown,
): Promise<UpdateProgressResult> {
  const parsed = migrateProgressInput.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }
  const { courseId, elementsCompleted, started, setAsCurrentCourse } =
    parsed.data;

  if (elementsCompleted.length === 0 && !started) {
    return { success: true };
  }

  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return { success: false, error: "Unauthenticated" };
  }

  try {
    const userRef = adminDB.collection("users").doc(sessionUser.uid);

    const updates: Record<string, unknown> = {
      unlockedCourses: FieldValue.arrayUnion(courseId),
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (elementsCompleted.length > 0) {
      updates[`courseProgress.${courseId}.elementsCompleted`] =
        FieldValue.arrayUnion(...elementsCompleted);
    }

    if (setAsCurrentCourse) {
      updates.currentCourse = courseId;
    }

    await userRef.update(updates);

    if (elementsCompleted.length > 0) {
      await recomputeCompletion(userRef, courseId);
    }

    return { success: true };
  } catch (error) {
    console.error("migrateGuestProgress failed:", error);
    return { success: false, error: "Failed to migrate guest progress" };
  }
}
