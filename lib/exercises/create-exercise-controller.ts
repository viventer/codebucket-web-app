import type {
  CourseElement,
  FillGapsContent,
  MatchPairsContent,
  MultiStageFillGapsContent,
} from "@/schemas/courseSchema";

export type FillGapsExerciseConfig = {
  kind: "fillGaps";
  content: FillGapsContent;
  hints: string[];
};

export type MultiStageFillGapsExerciseConfig = {
  kind: "multiStageFillGaps";
  content: MultiStageFillGapsContent;
  hints: string[];
};

export type MatchPairsExerciseConfig = {
  kind: "matchPairs";
  content: MatchPairsContent;
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

export function getMultiStageFillGapsExerciseConfig(
  element: CourseElement,
): MultiStageFillGapsExerciseConfig | null {
  if (element.type !== "interactiveExercise") {
    return null;
  }

  if (element.content.type !== "multiStageFillGaps") {
    return null;
  }

  return {
    kind: "multiStageFillGaps",
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

export function getExerciseHints(element: CourseElement): string[] {
  if (element.type === "codeExercise") {
    return element.content.hints ?? [];
  }

  if (element.type === "interactiveExercise") {
    return element.content.hints ?? [];
  }

  return [];
}
