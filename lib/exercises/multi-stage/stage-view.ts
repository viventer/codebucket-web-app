import {
  isSelectCorrectComplete,
  isSelectCorrectLocked,
  type SelectCorrectPersistedState,
} from "../select-correct/select-correct-state";
import type { ExerciseFeedback } from "../shared/types";

import type { StageState } from "./stage-state";

function isFillGapsStagePassed(feedback: StageState["feedback"]): boolean {
  return (
    feedback === "success" ||
    feedback === "solution" ||
    feedback === "stageSuccess" ||
    feedback === "stageSolution"
  );
}

export function isStageSatisfied(state: StageState): boolean {
  if (state.kind === "fillGaps" || state.kind === "fillCode") {
    return isFillGapsStagePassed(state.feedback);
  }

  if (state.kind === "matchPairs") {
    return state.isComplete;
  }

  if (state.kind === "selectCorrect") {
    if (
      state.selectCorrect.attempt === "retry" &&
      (state.selectCorrect.phase === "correct" ||
        state.selectCorrect.phase === "wrongResolved")
    ) {
      return true;
    }

    if (state.firstAttemptWrong) {
      return state.retryCompleted;
    }

    return state.selectCorrect.phase === "correct";
  }

  return false;
}

export function deriveIsExerciseComplete(stages: StageState[]): boolean {
  return stages.every(isStageSatisfied);
}

export function deriveIsCurrentStageComplete(state: StageState): boolean {
  if (state.kind === "selectCorrect") {
    return isSelectCorrectComplete(state.selectCorrect);
  }

  if (state.kind === "fillGaps" || state.kind === "fillCode") {
    return isFillGapsStagePassed(state.feedback);
  }

  if (state.kind === "matchPairs") {
    return state.isComplete;
  }

  return false;
}

export function deriveMultiStageFeedback(
  state: StageState,
  selectCorrectPersisted: SelectCorrectPersistedState | null,
  isLastStage: boolean,
): ExerciseFeedback {
  if (state.kind === "fillGaps" || state.kind === "fillCode" || state.kind === "matchPairs") {
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
    if (selectCorrectPersisted.attempt === "retry") {
      return isLastStage ? "success" : "stageSuccess";
    }

    return "success";
  }

  if (selectCorrectPersisted?.phase === "wrongDeferred") {
    return "stageWrongFirst";
  }

  if (
    selectCorrectPersisted?.attempt === "retry" &&
    (selectCorrectPersisted.phase === "wrongPending" ||
      selectCorrectPersisted.phase === "wrongResolved")
  ) {
    return "stageWrongRetry";
  }

  return "idle";
}

export function deriveHasAttemptedCheck(
  state: StageState,
  selectCorrectPersisted: SelectCorrectPersistedState | null,
): boolean {
  if (state.kind === "fillGaps" || state.kind === "fillCode") {
    return state.hasAttemptedCheck;
  }

  return selectCorrectPersisted
    ? isSelectCorrectLocked(selectCorrectPersisted)
    : false;
}
