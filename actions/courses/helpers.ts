import type {
  CourseElement,
  CourseElementDocument,
  CourseOutline,
} from "@/schemas/courseSchema";

export function toCourseElement(
  document: CourseElementDocument,
): CourseElement {
  const { displayTitle: _displayTitle, ...element } = document;
  return element;
}

export function sortOutlineSections(outline: CourseOutline) {
  return [...outline.sections].sort((a, b) => a.order - b.order);
}

export function sortOutlineElements<T extends { order: number }>(elements: T[]) {
  return [...elements].sort((a, b) => a.order - b.order);
}

export function buildOrderedElementRefs(outline: CourseOutline) {
  return sortOutlineSections(outline).flatMap((section) =>
    sortOutlineElements(section.elements).map((element) => ({
      sectionId: section.id,
      elementId: element.id,
    })),
  );
}
