import type {
  ChooseMatchingStage,
  FillCodeStage,
  FillGapsStage,
  MatchPairsStage,
  ExerciseStage,
  SelectCorrectStage,
} from "@/schemas/courseSchema";

import type { StageActionBarVariant } from "../shared/types";

export function isFillGapsStage(
  stage: ExerciseStage,
): stage is FillGapsStage {
  return stage.type === "fillGaps";
}

export function isFillCodeStage(
  stage: ExerciseStage,
): stage is FillCodeStage {
  return stage.type === "fillCode";
}

export function isSelectCorrectStage(
  stage: ExerciseStage,
): stage is SelectCorrectStage {
  return stage.type === "selectCorrect";
}

export function isChooseMatchingStage(
  stage: ExerciseStage,
): stage is ChooseMatchingStage {
  return stage.type === "chooseMatching";
}

export function isMatchPairsStage(
  stage: ExerciseStage,
): stage is MatchPairsStage {
  return stage.type === "matchPairs";
}

export function getStageActionBarVariant(
  stage: ExerciseStage,
): StageActionBarVariant {
  return stage.type === "fillGaps" ||
    stage.type === "fillCode" ||
    stage.type === "chooseMatching"
    ? "check"
    : "gated";
}
