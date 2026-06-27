import type { CourseElement, MultiStageContent } from "@/schemas/courseSchema";

export type MultiStageExerciseConfig = {
  kind: "multiStage";
  content: MultiStageContent;
  hints: string[];
};

export function getMultiStageExerciseConfig(
  element: CourseElement,
): MultiStageExerciseConfig | null {
  if (element.type !== "interactiveExercise") {
    return null;
  }

  if (element.content.type !== "multiStage") {
    return null;
  }

  return {
    kind: "multiStage",
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
