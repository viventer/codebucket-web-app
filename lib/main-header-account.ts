import { getCourseTitle } from "@/lib/courses";
import { mockUser } from "@/lib/mock-user";

export function getMainHeaderAccount() {
  const isAuthenticated = true;

  const account = isAuthenticated
    ? {
        email: mockUser.email,
        courses: mockUser.unlockedCourses.map((courseId) => ({
          id: courseId,
          title: getCourseTitle(courseId) ?? courseId,
        })),
        currentCourseId: mockUser.currentCourse,
      }
    : undefined;

  return { isAuthenticated, account };
}
