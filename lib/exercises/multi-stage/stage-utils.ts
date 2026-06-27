import type {
  ChooseMatchingStage,
  FillCodeStage,
  FillGapsStage,
  MatchPairsStage,
  MultiStageStage,
  SelectCorrectStage,
} from "@/schemas/courseSchema";

import type { StageActionBarVariant } from "../shared/types";

export function isFillGapsStage(
  stage: MultiStageStage,
): stage is FillGapsStage {
  return stage.type === "fillGaps";
}

export function isFillCodeStage(
  stage: MultiStageStage,
): stage is FillCodeStage {
  return stage.type === "fillCode";
}

export function isSelectCorrectStage(
  stage: MultiStageStage,
): stage is SelectCorrectStage {
  return stage.type === "selectCorrect";
}

export function isChooseMatchingStage(
  stage: MultiStageStage,
): stage is ChooseMatchingStage {
  return stage.type === "chooseMatching";
}

export function isMatchPairsStage(
  stage: MultiStageStage,
): stage is MatchPairsStage {
  return stage.type === "matchPairs";
}

export function getStageActionBarVariant(
  stage: MultiStageStage,
): StageActionBarVariant {
  return stage.type === "fillGaps" ||
    stage.type === "fillCode" ||
    stage.type === "chooseMatching"
    ? "check"
    : "gated";
}
