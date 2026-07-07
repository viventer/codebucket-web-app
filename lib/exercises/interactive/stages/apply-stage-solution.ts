import type { FillCodeStage, FillGapsStage } from "@/schemas/exerciseSchema";

import { applyFillGapsSolution } from "../../fill-gaps/fill-gaps-utils";

import type { FillCodeStageState, FillGapsStageState } from "../stage-state";

export function applyFillGapsStageSolution(
  stage: FillGapsStage,
  state: FillGapsStageState,
): FillGapsStageState {
  return {
    ...state,
    assignments: applyFillGapsSolution(stage, state.assignments),
    activeGapId: null,
  };
}

export function applyFillCodeStageSolution(
  stage: FillCodeStage,
  state: FillCodeStageState,
): FillCodeStageState {
  return {
    ...state,
    assignments: applyFillGapsSolution(stage, state.assignments),
    activeGapId: null,
  };
}
