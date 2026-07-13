import { notFound } from "next/navigation";

import {
  getAllCourseElementParams,
  getCourseElement,
  getCourseNavigationData,
} from "@/actions/courses/read-courses";
import {
  buildOrderedElementRefs,
  sortOutlineElements,
  sortOutlineSections,
  toCourseElement,
} from "@/actions/courses/helpers";
import {
  getCoursePath,
  elementHasHint,
  elementHideInfoOnMobile,
  elementCentersMediaOnMobile,
  elementHasMaterials,
} from "@/lib/courses";
import { buildCourseNavigationMetadata } from "@/lib/course/build-navigation-metadata";
import { mockUser } from "@/lib/mock-user";
import {
  getCompletedElementIds,
  getSectionProgress,
  getSectionsCompleted,
} from "@/lib/course/progress";
import { CourseElementShell } from "@/components/course/CourseElementShell";

export async function generateStaticParams() {
  return getAllCourseElementParams();
}

type ElementLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string; section: string; element: string }>;
};

export default async function ElementLayout({
  children,
  params,
}: ElementLayoutProps) {
  const { id, section: sectionId, element: elementId } = await params;

  const [navigationData, currentElementDocument] = await Promise.all([
    getCourseNavigationData(id),
    getCourseElement(id, sectionId, elementId),
  ]);

  if (!navigationData || !currentElementDocument) notFound();

  const { course, outline } = navigationData;
  const currentSection = outline.sections.find(
    (section) => section.id === sectionId,
  );
  if (!currentSection) notFound();

  const currentElement = toCourseElement(currentElementDocument);
  const orderedElements = buildOrderedElementRefs(outline);

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
    const nextSection = outline.sections.find(
      (section) => section.id === next.sectionId,
    );
    const nextEl = nextSection?.elements.find(
      (element) => element.id === next.elementId,
    );
    if (nextEl) {
      nextElement = { id: nextEl.id, title: nextEl.displayTitle };
    }
  }

  const navigationMetadata = buildCourseNavigationMetadata(
    { id: course.id, outline },
    sectionId,
    elementId,
    orderedElements,
    currentIndex,
    {
      id: currentElement.id,
      title: currentElementDocument.displayTitle,
      type: currentElement.type,
    },
    nextElement,
  );

  const user = mockUser;
  const completedIds = getCompletedElementIds(user, course.id);
  const elementsCompleted = Array.from(completedIds);
  const sectionsCompleted = getSectionsCompleted(user, course.id);
  const progress = getSectionProgress(
    course.id,
    sortOutlineElements(currentSection.elements).map((element) => element.id),
    user,
  );

  const sections = sortOutlineSections(outline).map((section) => ({
    id: section.id,
    title: section.title,
    order: section.order,
    elements: sortOutlineElements(section.elements).map((element) => ({
      id: element.id,
      title: element.displayTitle,
      type: element.type,
      completed: completedIds.has(element.id),
    })),
  }));

  const isExercise =
    currentElement.type === "platformCodeExercise" ||
    currentElement.type === "localCodeExercise" ||
    currentElement.type === "interactiveExercise" ||
    currentElement.type === "customExercise";

  const continueHref =
    currentElement.type === "courseEnding"
      ? (() => {
          const recommendedCourseId =
            currentElement.content.nextSteps.recommendedCourseIds[0];
          return recommendedCourseId
            ? getCoursePath(recommendedCourseId)
            : null;
        })()
      : null;

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
      }}
      actionBarProps={{
        type: currentElement.type,
        title: currentElementDocument.displayTitle,
        sectionOrder: currentSection.order,
        sectionTitle: currentSection.title,
        hideInfoOnMobile: elementHideInfoOnMobile(currentElement),
        prevHref,
        nextHref,
        continueHref,
        hasMaterials: elementHasMaterials(currentElement),
        hasHint: elementHasHint(currentElement),
      }}
      isExercise={isExercise}
      exerciseElement={currentElement}
      centerContentOnMobile={elementCentersMediaOnMobile(currentElement)}
    >
      {children}
    </CourseElementShell>
  );
}
