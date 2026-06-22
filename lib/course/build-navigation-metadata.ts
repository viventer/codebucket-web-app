import type { Course } from "@/schemas/courseSchema";

import type { CourseNavigationMetadata } from "./navigation-transition-types";

type OrderedElementRef = {
  sectionId: string;
  elementId: string;
};

export function buildCourseNavigationMetadata(
  course: Course,
  sectionId: string,
  elementId: string,
  orderedElements: OrderedElementRef[],
  currentIndex: number,
): CourseNavigationMetadata {
  const currentSection = course.sections.find((section) => section.id === sectionId);
  if (!currentSection) {
    throw new Error(`Section not found: ${sectionId}`);
  }

  const prev = currentIndex > 0 ? orderedElements[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < orderedElements.length - 1
      ? orderedElements[currentIndex + 1]
      : undefined;

  const getSectionRef = (targetSectionId: string) => {
    const section = course.sections.find((item) => item.id === targetSectionId);
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
    prevSection: prev ? getSectionRef(prev.sectionId) : null,
    nextSection: next ? getSectionRef(next.sectionId) : null,
    isNextSectionChange: next ? next.sectionId !== sectionId : false,
    isPrevSectionChange: prev ? prev.sectionId !== sectionId : false,
  };
}
