import type { CourseElement, InteractiveExerciseContent } from "@/schemas/courseSchema";

export type InteractiveExerciseConfig = {
  kind: "interactive";
  content: InteractiveExerciseContent;
  hints: string[];
};

export function getInteractiveExerciseConfig(
  element: CourseElement,
): InteractiveExerciseConfig | null {
  if (element.type !== "interactiveExercise") {
    return null;
  }

  return {
    kind: "interactive",
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

  if (element.type === "customExercise") {
    return element.content.hints ?? [];
  }

  return [];
}
