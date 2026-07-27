"use server";

import { z } from "zod";

import { adminDB } from "@/firebase/admin-init";
import { getSessionUser } from "@/lib/auth/session";
import type { CourseProgressEntry } from "@/schemas/userSchema";

const inputSchema = z.object({
  courseId: z.string().min(1),
});

export type CourseLandingStateResult =
  | { success: true; unlocked: boolean; elementsCompleted: string[] }
  | { success: false; error: string };

/**
 * Read-only ownership + progress for the course landing CTA.
 * Intentionally does not reuse getCourseProgress — that action writes
 * unlockedCourses for free courses as a side effect.
 */
export async function getCourseLandingState(
  input: unknown,
): Promise<CourseLandingStateResult> {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const { courseId } = parsed.data;
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return { success: false, error: "Unauthenticated" };
  }

  try {
    const userDoc = await adminDB.collection("users").doc(sessionUser.uid).get();
    const data = userDoc.data();

    const unlockedCourses: string[] = data?.unlockedCourses ?? [];
    const rawEntry = data?.courseProgress?.[courseId] as
      | Partial<CourseProgressEntry>
      | undefined;

    return {
      success: true,
      unlocked: unlockedCourses.includes(courseId),
      elementsCompleted: rawEntry?.elementsCompleted ?? [],
    };
  } catch (error) {
    console.error("getCourseLandingState failed:", error);
    return { success: false, error: "Failed to fetch landing state" };
  }
}
