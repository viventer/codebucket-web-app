import type { CourseOutline } from "@/schemas/courseSchema";

import type {
  CourseElementNavRef,
  CourseNavigationMetadata,
} from "./navigation-transition-types";

type OrderedElementRef = {
  sectionId: string;
  elementId: string;
};

export type CourseNavigationInput = {
  id: string;
  outline: CourseOutline;
};

export function buildCourseNavigationMetadata(
  course: CourseNavigationInput,
  sectionId: string,
  elementId: string,
  orderedElements: OrderedElementRef[],
  currentIndex: number,
  currentElement: CourseElementNavRef,
  nextElement: { id: string; title: string } | null,
): CourseNavigationMetadata {
  const currentSection = course.outline.sections.find(
    (section) => section.id === sectionId,
  );
  if (!currentSection) {
    throw new Error(`Section not found: ${sectionId}`);
  }

  const prev = currentIndex > 0 ? orderedElements[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < orderedElements.length - 1
      ? orderedElements[currentIndex + 1]
      : undefined;

  const getSectionRef = (targetSectionId: string) => {
    const section = course.outline.sections.find(
      (item) => item.id === targetSectionId,
    );
    if (!section) {
      return null;
    }

    return {
      id: section.id,
      title: section.title,
      order: section.order,
    };
  };

  return {
    items: orderedElements.map((item) => ({
      sectionId: item.sectionId,
      elementId: item.elementId,
      path: `/course/${course.id}/${item.sectionId}/${item.elementId}`,
    })),
    currentIndex,
    currentSection: {
      id: currentSection.id,
      title: currentSection.title,
      order: currentSection.order,
    },
    currentElement,
    nextElement,
    prevSection: prev ? getSectionRef(prev.sectionId) : null,
    nextSection: next ? getSectionRef(next.sectionId) : null,
    isNextSectionChange: next ? next.sectionId !== sectionId : false,
    isPrevSectionChange: prev ? prev.sectionId !== sectionId : false,
  };
}
