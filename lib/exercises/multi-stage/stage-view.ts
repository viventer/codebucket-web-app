import {
  isSelectCorrectComplete,
  isSelectCorrectLocked,
  type SelectCorrectPersistedState,
} from "../select-correct/select-correct-state";
import type { ExerciseFeedback } from "../shared/types";

import type { StageState } from "./stage-state";

export function deriveIsCurrentStageComplete(state: StageState): boolean {
  if (state.kind === "selectCorrect") {
    return isSelectCorrectComplete(state.selectCorrect);
  }

  if (state.kind === "fillGaps") {
    return state.feedback === "success" || state.feedback === "solution";
  }

  return false;
}

export function deriveMultiStageFeedback(
  state: StageState,
  selectCorrectPersisted: SelectCorrectPersistedState | null,
): ExerciseFeedback {
  if (state.kind === "fillGaps") {
    return state.feedback;
  }

  if (
    state.feedback === "stageSuccess" ||
    state.feedback === "stageSolution" ||
    state.feedback === "success" ||
    state.feedback === "solution"
  ) {
    return state.feedback;
  }

  if (selectCorrectPersisted?.phase === "correct") {
    return "success";
  }

  if (
    selectCorrectPersisted?.phase === "wrongPending" ||
    selectCorrectPersisted?.phase === "wrongResolved"
  ) {
    return "error";
  }

  return "idle";
}

export function deriveHasAttemptedCheck(
  state: StageState,
  selectCorrectPersisted: SelectCorrectPersistedState | null,
): boolean {
  if (state.kind === "fillGaps") {
    return state.hasAttemptedCheck;
  }

  return selectCorrectPersisted
    ? isSelectCorrectLocked(selectCorrectPersisted)
    : false;
}
