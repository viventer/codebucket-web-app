"use server";

import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";

import { adminDB } from "@/firebase/admin-init";
import { getSessionUser } from "@/lib/session";
import { getCourseNavigationData } from "@/actions/courses/read-courses";
import { sortOutlineElements } from "@/actions/courses/helpers";
import type { CourseProgressEntry } from "@/schemas/userSchema";

export type CourseProgressResult =
  | { success: true; entry: CourseProgressEntry }
  | { success: false; error: string };

export type UpdateProgressResult =
  | { success: true }
  | { success: false; error: string };

const updateProgressInput = z.object({
  courseId: z.string().min(1),
  elementId: z.string().min(1),
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
      | Partial<CourseProgressEntry>
      | undefined;

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

    // Atomically add element to elementsCompleted
    await userRef.update({
      [`courseProgress.${courseId}.elementsCompleted`]:
        FieldValue.arrayUnion(elementId),
      currentCourse: courseId,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // After updating, check if the element's section is now fully complete
    const [navData, userDoc] = await Promise.all([
      getCourseNavigationData(courseId),
      userRef.get(),
    ]);

    if (!navData) {
      return { success: true };
    }

    const data = userDoc.data();
    const rawEntry = data?.courseProgress?.[courseId] as
      | Partial<CourseProgressEntry>
      | undefined;
    const nowCompleted = new Set<string>(rawEntry?.elementsCompleted ?? []);
    const sectionsAlreadyCompleted: string[] =
      rawEntry?.sectionsCompleted ?? [];

    // Find which section owns the element
    const owningSection = navData.outline.sections.find((section) =>
      section.elements.some((el) => el.id === elementId),
    );

    const sectionUpdates: Record<string, unknown> = {};

    if (owningSection) {
      const allElementIds = sortOutlineElements(owningSection.elements).map(
        (el) => el.id,
      );
      const sectionNowComplete = allElementIds.every((id) =>
        nowCompleted.has(id),
      );

      if (
        sectionNowComplete &&
        !sectionsAlreadyCompleted.includes(owningSection.id)
      ) {
        sectionUpdates[`courseProgress.${courseId}.sectionsCompleted`] =
          FieldValue.arrayUnion(owningSection.id);
      }
    }

    // Check overall course completion
    const allSections = navData.outline.sections;
    const sectionsAfterUpdate = owningSection
      ? [
          ...sectionsAlreadyCompleted,
          ...(sectionUpdates[
            `courseProgress.${courseId}.sectionsCompleted`
          ] !== undefined
            ? [owningSection.id]
            : []),
        ]
      : sectionsAlreadyCompleted;

    const allSectionIds = allSections.map((s) => s.id);
    const courseComplete = allSectionIds.every((id) =>
      sectionsAfterUpdate.includes(id),
    );

    if (Object.keys(sectionUpdates).length > 0 || courseComplete) {
      if (courseComplete) {
        await userRef.update({
          ...sectionUpdates,
          completedCourses: FieldValue.arrayUnion(courseId),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        await userRef.update({
          ...sectionUpdates,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("updateCourseProgress failed:", error);
    return { success: false, error: "Failed to update progress" };
  }
}
