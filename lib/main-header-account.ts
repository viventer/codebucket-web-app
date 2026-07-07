import { getCourseTitle } from "@/actions/courses/read-courses";
import { mockUser } from "@/lib/mock-user";

export async function getMainHeaderAccount() {
  const isAuthenticated = true;

  const account = isAuthenticated
    ? {
        email: mockUser.email,
        courses: await Promise.all(
          mockUser.unlockedCourses.map(async (courseId) => ({
            id: courseId,
            title: (await getCourseTitle(courseId)) ?? courseId,
          })),
        ),
        currentCourseId: mockUser.currentCourse,
      }
    : undefined;

  return { isAuthenticated, account };
}
