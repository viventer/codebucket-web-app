import type { CourseElement } from "@/schemas/courseSchema";

export function getCoursePath(courseId: string): string {
  return `/course/${courseId}`;
}

const ELEMENT_TYPE_LABELS: Record<CourseElement["type"], string> = {
  video: "Lekcja",
  platformCodeExercise: "Ćwiczenie",
  localCodeExercise: "Ćwiczenie",
  interactiveExercise: "Ćwiczenie",
  customExercise: "Ćwiczenie",
  interactiveDemo: "Demonstracja",
  guidedProject: "Projekt",
  individualProject: "Projekt indywidualny",
  cheatsheet: "Ściąga",
  courseEnding: "Zakończenie",
};

export function getElementTitle(element: CourseElement): string {
  if (element.type === "courseEnding") {
    return element.content.congrats.heading;
  }

  if ("title" in element.content && element.content.title) {
    return element.content.title;
  }
  return ELEMENT_TYPE_LABELS[element.type];
}

export function elementHasHint(element: CourseElement): boolean {
  if (
    element.type !== "platformCodeExercise" &&
    element.type !== "localCodeExercise" &&
    element.type !== "interactiveExercise" &&
    element.type !== "customExercise"
  ) {
    return false;
  }

  if (element.type === "platformCodeExercise") {
    return element.content.hints.length > 0;
  }

  return (element.content.hints?.length ?? 0) > 0;
}

export function elementHideInfoOnMobile(element: CourseElement): boolean {
  if (
    element.type !== "interactiveExercise" &&
    element.type !== "customExercise"
  ) {
    return false;
  }

  return true;
}

export function elementCentersMediaOnMobile(element: CourseElement): boolean {
  return (
    element.type === "video" ||
    element.type === "guidedProject" ||
    element.type === "cheatsheet"
  );
}

export function elementHasMaterials(element: CourseElement): boolean {
  if (
    element.type === "localCodeExercise" ||
    element.type === "guidedProject"
  ) {
    return element.content.hasMaterials;
  }

  if (element.type !== "individualProject") {
    return false;
  }

  const materials = element.content.materials;
  return (materials?.filter((item) => item.trim().length > 0).length ?? 0) > 0;
}
