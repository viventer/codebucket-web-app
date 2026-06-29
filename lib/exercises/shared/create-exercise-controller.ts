import type {
  CourseElement,
  InteractiveExerciseContent,
  LocalCodeExerciseContent,
} from "@/schemas/courseSchema";

export type InteractiveExerciseConfig = {
  kind: "interactive";
  content: InteractiveExerciseContent;
  hints: string[];
};

export type LocalCodeExerciseConfig = {
  kind: "localCode";
  content: LocalCodeExerciseContent;
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

export function getLocalCodeExerciseConfig(
  element: CourseElement,
): LocalCodeExerciseConfig | null {
  if (element.type !== "localCodeExercise") {
    return null;
  }

  return {
    kind: "localCode",
    content: element.content,
    hints: element.content.hints ?? [],
  };
}

export function getExerciseHints(element: CourseElement): string[] {
  if (element.type === "platformCodeExercise") {
    return element.content.hints ?? [];
  }

  if (element.type === "localCodeExercise") {
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
