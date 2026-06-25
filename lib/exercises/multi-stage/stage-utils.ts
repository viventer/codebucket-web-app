import type {
  FillGapsStage,
  MatchPairsStage,
  MultiStageStage,
  SelectCorrectStage,
} from "@/schemas/courseSchema";

import type { StageActionBarVariant } from "../shared/types";

export function isFillGapsStage(stage: MultiStageStage): stage is FillGapsStage {
  return stage.type === "fillGaps";
}

export function isSelectCorrectStage(
  stage: MultiStageStage,
): stage is SelectCorrectStage {
  return stage.type === "selectCorrect";
}

export function isMatchPairsStage(
  stage: MultiStageStage,
): stage is MatchPairsStage {
  return stage.type === "matchPairs";
}

export function getStageActionBarVariant(
  stage: MultiStageStage,
): StageActionBarVariant {
  return stage.type === "fillGaps" ? "check" : "gated";
}
