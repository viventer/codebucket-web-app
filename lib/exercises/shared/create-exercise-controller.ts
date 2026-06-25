import type {
  CourseElement,
  FillCodeContent,
  FillGapsContent,
  MatchPairsContent,
  MultiStageContent,
  SelectCorrectContent,
} from "@/schemas/courseSchema";

export type FillGapsExerciseConfig = {
  kind: "fillGaps";
  content: FillGapsContent;
  hints: string[];
};

export type FillCodeExerciseConfig = {
  kind: "fillCode";
  content: FillCodeContent;
  hints: string[];
};

export type MultiStageExerciseConfig = {
  kind: "multiStage";
  content: MultiStageContent;
  hints: string[];
};

export type MatchPairsExerciseConfig = {
  kind: "matchPairs";
  content: MatchPairsContent;
};

export type SelectCorrectExerciseConfig = {
  kind: "selectCorrect";
  content: SelectCorrectContent;
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

export function getFillCodeExerciseConfig(
  element: CourseElement,
): FillCodeExerciseConfig | null {
  if (element.type !== "interactiveExercise") {
    return null;
  }

  if (element.content.type !== "fillCode") {
    return null;
  }

  return {
    kind: "fillCode",
    content: element.content,
    hints: element.content.hints ?? [],
  };
}

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

export function getMatchPairsExerciseConfig(
  element: CourseElement,
): MatchPairsExerciseConfig | null {
  if (element.type !== "interactiveExercise") {
    return null;
  }

  if (element.content.type !== "matchPairs") {
    return null;
  }

  return {
    kind: "matchPairs",
    content: element.content,
  };
}

export function getSelectCorrectExerciseConfig(
  element: CourseElement,
): SelectCorrectExerciseConfig | null {
  if (element.type !== "interactiveExercise") {
    return null;
  }

  if (element.content.type !== "selectCorrect") {
    return null;
  }

  return {
    kind: "selectCorrect",
    content: element.content,
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
