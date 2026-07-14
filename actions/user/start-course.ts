"use server";

import { FieldValue } from "firebase-admin/firestore";

import { adminDB } from "@/firebase/admin-init";
import { getSessionUser } from "@/lib/session";
import { getCourseNavigationData } from "@/actions/courses/read-courses";

export type StartCourseResult =
  | { success: true }
  | { success: false; needsAuth: true }
  | { success: false; needsAuth?: false; error: string };

export async function startCourse(courseId: string): Promise<StartCourseResult> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return { success: false, needsAuth: true };
  }

  try {
    const navData = await getCourseNavigationData(courseId);
    if (!navData) {
      return { success: false, error: "Course not found" };
    }

    if (!navData.course.price.isFree) {
      // Paid courses: unlock is handled by the payment flow
      return { success: false, error: "Course requires payment" };
    }

    await adminDB.collection("users").doc(sessionUser.uid).update({
      unlockedCourses: FieldValue.arrayUnion(courseId),
      currentCourse: courseId,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("startCourse failed:", error);
    return { success: false, error: "Failed to start course" };
  }
}
