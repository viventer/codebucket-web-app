import type { CourseElement, FillGapsContent } from "@/schemas/courseSchema";

export type FillGapsExerciseConfig = {
  kind: "fillGaps";
  content: FillGapsContent;
  hints: string[];
};

export function getFillGapsExerciseConfig(
  element: CourseElement,
): FillGapsExerciseConfig | null {
  if (element.type !== "interactiveExercise") {
    return null;
  }

  if (element.content.type !== "fillGaps") {
    return null;
  }

  return {
    kind: "fillGaps",
    content: element.content,
    hints: element.content.hints ?? [],
  };
}

export function getExerciseHints(element: CourseElement): string[] {
  if (element.type === "codeExercise") {
    return element.content.hints ?? [];
  }

  if (element.type === "interactiveExercise") {
    return element.content.hints ?? [];
  }

  return [];
}
