import { notFound } from "next/navigation";

import {
  getCourseById,
  getCourseTitle,
  getElementTitle,
  elementHasHint,
  elementHideInfoOnMobile,
  elementHasMaterials,
} from "@/lib/courses";
import { buildCourseNavigationMetadata } from "@/lib/course/build-navigation-metadata";
import { mockUser } from "@/lib/mock-user";
import {
  getCompletedElementIds,
  getSectionProgress,
  getSectionsCompleted,
} from "@/lib/progress";
import { CourseElementShell } from "@/components/course/CourseElementShell";

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

  let nextElement: { id: string; title: string } | null = null;
  if (next) {
    const nextSection = course.sections.find((s) => s.id === next.sectionId);
    const nextEl = nextSection?.elements.find((e) => e.id === next.elementId);
    if (nextEl) {
      nextElement = { id: nextEl.id, title: getElementTitle(nextEl) };
    }
  }

  const navigationMetadata = buildCourseNavigationMetadata(
    course,
    sectionId,
    elementId,
    orderedElements,
    currentIndex,
    {
      id: currentElement.id,
      title: getElementTitle(currentElement),
      type: currentElement.type,
    },
    nextElement,
  );

  const user = mockUser;
  const completedIds = getCompletedElementIds(user, course.id);
  const elementsCompleted = Array.from(completedIds);
  const sectionsCompleted = getSectionsCompleted(user, course.id);
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
          type: element.type,
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

  const isExercise =
    currentElement.type === "codeExercise" ||
    currentElement.type === "interactiveExercise" ||
    currentElement.type === "customExercise";

  return (
    <CourseElementShell
      navigationMetadata={navigationMetadata}
      sectionsCompleted={sectionsCompleted}
      elementsCompleted={elementsCompleted}
      headerProps={{
        courseId: course.id,
        courseTitle: course.title,
        sectionTitle: currentSection.title,
        sections,
        currentSectionId: sectionId,
        currentElementId: elementId,
        progress,
        account,
      }}
      actionBarProps={{
        type: currentElement.type,
        title: getElementTitle(currentElement),
        sectionOrder: currentSection.order,
        sectionTitle: currentSection.title,
        hideInfoOnMobile: elementHideInfoOnMobile(currentElement),
        prevHref,
        nextHref,
        hasMaterials: elementHasMaterials(currentElement),
        hasHint: elementHasHint(currentElement),
      }}
      isExercise={isExercise}
      exerciseElement={currentElement}
    >
      {children}
    </CourseElementShell>
  );
}
