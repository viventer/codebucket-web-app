import type {
  FillCodeStage,
  FillGapsStage,
} from "@/schemas/courseSchema";

import { evaluateFillGapsCheck } from "../../fill-gaps/fill-gaps-utils";
import { isSelectCorrectComplete } from "../../select-correct/select-correct-state";
import type { CheckResult } from "../../shared/types";

import type { StageState } from "../stage-state";

export function checkSelectCorrectStage(state: StageState): CheckResult {
  if (state.kind !== "selectCorrect") {
    return "warning";
  }

  return isSelectCorrectComplete(state.selectCorrect) ? "success" : "warning";
}

export function checkMatchPairsStage(state: StageState): CheckResult {
  if (state.kind !== "matchPairs") {
    return "warning";
  }

  return state.isComplete ? "success" : "warning";
}

export function checkFillGapsStage(
  stage: FillGapsStage,
  state: StageState,
): CheckResult {
  if (state.kind !== "fillGaps") {
    return "warning";
  }

  return evaluateFillGapsCheck(stage, state.assignments);
}

export function checkFillCodeStage(
  stage: FillCodeStage,
  state: StageState,
): CheckResult {
  if (state.kind !== "fillCode") {
    return "warning";
  }

  return evaluateFillGapsCheck(stage, state.assignments, {
    caseInsensitive: true,
  });
}