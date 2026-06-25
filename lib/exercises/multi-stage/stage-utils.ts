import type {
  FillGapsStage,
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

export function getStageActionBarVariant(
  stage: MultiStageStage,
): StageActionBarVariant {
  return stage.type === "selectCorrect" ? "gated" : "check";
}
