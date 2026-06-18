import { notFound } from "next/navigation";

import { getCourseById, getCourseTitle, getElementTitle, elementHasMaterials } from "@/lib/courses";
import { mockUser } from "@/lib/mock-user";
import { getCompletedElementIds, getSectionProgress } from "@/lib/progress";
import { ElementActionBar } from "@/components/course/element-action-bar";
import { CourseHeader } from "@/components/course/CourseHeader";

type ElementLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string; section: string; element: string }>;
};

export default async function ElementLayout({
  children,
  params,
}: ElementLayoutProps) {
  const { id, section: sectionId, element: elementId } = await params;

  const course = await getCourseById(id);
  if (!course) notFound();

  const currentSection = course.sections.find((s) => s.id === sectionId);
  if (!currentSection) notFound();

  const currentElement = currentSection.elements.find(
    (e) => e.id === elementId,
  );
  if (!currentElement) notFound();

  const orderedElements = [...course.sections]
    .sort((a, b) => a.order - b.order)
    .flatMap((section) =>
      [...section.elements]
        .sort((a, b) => a.order - b.order)
        .map((element) => ({
          sectionId: section.id,
          elementId: element.id,
        })),
    );

  const currentIndex = orderedElements.findIndex(
    (item) => item.sectionId === sectionId && item.elementId === elementId,
  );

  const prev = currentIndex > 0 ? orderedElements[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < orderedElements.length - 1
      ? orderedElements[currentIndex + 1]
      : undefined;

  const prevHref = prev
    ? `/course/${course.id}/${prev.sectionId}/${prev.elementId}`
    : null;
  const nextHref = next
    ? `/course/${course.id}/${next.sectionId}/${next.elementId}`
    : null;

  const user = mockUser;
  const completedIds = getCompletedElementIds(user, course.id);
  const progress = getSectionProgress(course, sectionId, user);

  const sections = [...course.sections]
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      id: section.id,
      title: section.title,
      order: section.order,
      elements: [...section.elements]
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
        currentElementId={elementId}
        progress={progress}
        account={account}
      />
      <main className="mx-auto mt-8 w-[95vw] max-w-[1280px] flex-1 pb-28">
        {children}
      </main>
      <ElementActionBar
        type={currentElement.type}
        title={getElementTitle(currentElement)}
        prevHref={prevHref}
        nextHref={nextHref}
        hasMaterials={elementHasMaterials(currentElement)}
      />
    </div>
  );
}
