import { createInitialChooseMatchingRetryState } from "../../choose-matching/choose-matching-state";
import { createInitialSelectCorrectRetryState } from "../../select-correct/select-correct-state";

import type {
  ChooseMatchingStageState,
  SelectCorrectStageState,
} from "../stage-state";

export function prepareSelectCorrectRetryStageState(
  state: SelectCorrectStageState,
): SelectCorrectStageState {
  return {
    ...state,
    selectCorrect: createInitialSelectCorrectRetryState(),
    feedback: "idle",
  };
}

export function prepareChooseMatchingRetryStageState(
  state: ChooseMatchingStageState,
): ChooseMatchingStageState {
  return {
    ...state,
    chooseMatching: createInitialChooseMatchingRetryState(),
    feedback: "idle",
  };
}
