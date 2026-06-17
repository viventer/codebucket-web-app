import { notFound } from "next/navigation";

import { getCourseById, getCourseTitle, getElementTitle } from "@/lib/courses";
import { mockUser } from "@/lib/mock-user";
import { getCompletedElementIds, getSectionProgress } from "@/lib/progress";
import { CourseHeader } from "@/components/course/CourseHeader";

type ChapterLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string; section: string; chapter: string }>;
};

export default async function ChapterLayout({
  children,
  params,
}: ChapterLayoutProps) {
  const { id, section: sectionId, chapter: chapterId } = await params;

  const course = await getCourseById(id);
  if (!course) notFound();

  const currentSection = course.sections.find((s) => s.id === sectionId);
  if (!currentSection) notFound();

  const user = mockUser;
  const completedIds = getCompletedElementIds(user, course.id);
  const progress = getSectionProgress(course, sectionId, user);

  const sections = [...course.sections]
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      id: section.id,
      title: section.title,
      order: section.order,
      chapters: [...section.elements]
        .sort((a, b) => a.order - b.order)
        .map((element) => ({
          id: element.id,
          title: getElementTitle(element),
          completed: completedIds.has(element.id),
        })),
    }));

  const account = {
    email: user.email,
    courses: user.unlockedCourses.map((courseId) => ({
      id: courseId,
      title: getCourseTitle(courseId) ?? courseId,
    })),
    currentCourseId: user.currentCourse,
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <CourseHeader
        courseId={course.id}
        courseTitle={course.title}
        sectionTitle={currentSection.title}
        sections={sections}
        currentSectionId={sectionId}
        currentChapterId={chapterId}
        progress={progress}
        account={account}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
