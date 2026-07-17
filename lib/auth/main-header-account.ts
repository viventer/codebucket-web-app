"use server";

import { getCourseTitle } from "@/actions/courses/read-courses";
import { getSessionUser } from "@/lib/auth/session";
import { userCanChangePassword } from "@/lib/auth/user-can-change-password";
import { adminDB } from "@/firebase/admin-init";

export async function getMainHeaderAccount() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return { isAuthenticated: false, account: undefined };
  }

  try {
    const [userDoc, canChangePassword] = await Promise.all([
      adminDB.collection("users").doc(sessionUser.uid).get(),
      userCanChangePassword(sessionUser.uid),
    ]);
    const userData = userDoc.data();
    const unlockedCourses: string[] = userData?.unlockedCourses ?? [];
    const currentCourse: string | undefined =
      userData?.currentCourse ?? undefined;

    const courses = await Promise.all(
      unlockedCourses.map(async (courseId) => ({
        id: courseId,
        title: (await getCourseTitle(courseId)) ?? courseId,
      })),
    );

    return {
      isAuthenticated: true,
      account: {
        email: sessionUser.email,
        courses,
        currentCourseId: currentCourse,
        canChangePassword,
      },
    };
  } catch {
    return {
      isAuthenticated: true,
      account: {
        email: sessionUser.email,
        courses: [],
        currentCourseId: undefined,
        canChangePassword: false,
      },
    };
  }
}
