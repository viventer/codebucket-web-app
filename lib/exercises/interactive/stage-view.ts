import {
  isChooseMatchingComplete,
  isChooseMatchingChecked,
  type ChooseMatchingPersistedState,
} from "../choose-matching/choose-matching-state";
import {
  isSelectCorrectComplete,
  isSelectCorrectLocked,
  type SelectCorrectPersistedState,
} from "../select-correct/select-correct-state";
import type { ExerciseFeedback } from "../shared/types";

import {
  isRetryableRetryDone,
  isRetryableStageComplete,
  isRetryableStageSatisfied,
} from "./retryable-stage";
import type { StageState } from "./stage-state";

function isFillGapsStagePassed(feedback: StageState["feedback"]): boolean {
  return (
    feedback === "success" ||
    feedback === "solution" ||
    feedback === "stageSuccess" ||
    feedback === "stageSolution"
  );
}

function isSelectCorrectStageSatisfied(state: SelectCorrectStageState): boolean {
  return isRetryableStageSatisfied(
    {
      firstAttemptWrong: state.firstAttemptWrong,
      retryCompleted: state.retryCompleted,
    },
    state.selectCorrect.phase,
    state.selectCorrect.attempt,
  );
}

function isChooseMatchingStageSatisfied(
  state: ChooseMatchingStageState,
): boolean {
  return isRetryableStageSatisfied(
    {
      firstAttemptWrong: state.firstAttemptWrong,
      retryCompleted: state.retryCompleted,
    },
    state.chooseMatching.phase,
    state.chooseMatching.attempt,
  );
}

type SelectCorrectStageState = Extract<StageState, { kind: "selectCorrect" }>;
type ChooseMatchingStageState = Extract<StageState, { kind: "chooseMatching" }>;

export function isStageSatisfied(state: StageState): boolean {
  if (state.kind === "fillGaps" || state.kind === "fillCode") {
    return isFillGapsStagePassed(state.feedback);
  }

  if (state.kind === "matchPairs") {
    return state.isComplete;
  }

  if (state.kind === "selectCorrect") {
    return isSelectCorrectStageSatisfied(state);
  }

  if (state.kind === "chooseMatching") {
    return isChooseMatchingStageSatisfied(state);
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

  if (state.kind === "chooseMatching") {
    return isChooseMatchingComplete(state.chooseMatching);
  }

  if (state.kind === "fillGaps" || state.kind === "fillCode") {
    return isFillGapsStagePassed(state.feedback);
  }

  if (state.kind === "matchPairs") {
    return state.isComplete;
  }

  return false;
}

export function deriveInteractiveExerciseFeedback(
  state: StageState,
  selectCorrectPersisted: SelectCorrectPersistedState | null,
  chooseMatchingPersisted: ChooseMatchingPersistedState | null,
  isLastStage: boolean,
): ExerciseFeedback {
  if (
    state.kind === "fillGaps" ||
    state.kind === "fillCode" ||
    state.kind === "matchPairs"
  ) {
    return state.feedback;
  }

  if (
    state.feedback === "stageSuccess" ||
    state.feedback === "stageSolution" ||
    state.feedback === "success" ||
    state.feedback === "solution" ||
    state.feedback === "stageCloseCall"
  ) {
    return state.feedback;
  }

  if (chooseMatchingPersisted) {
    if (chooseMatchingPersisted.phase === "correct") {
      if (chooseMatchingPersisted.attempt === "retry") {
        return isLastStage ? "success" : "stageSuccess";
      }

      return "stageSuccess";
    }

    if (
      chooseMatchingPersisted.phase === "wrongDeferred" ||
      chooseMatchingPersisted.phase === "wrongResolved"
    ) {
      return "stageCloseCall";
    }
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
  chooseMatchingPersisted: ChooseMatchingPersistedState | null,
): boolean {
  if (state.kind === "fillGaps" || state.kind === "fillCode") {
    return state.hasAttemptedCheck;
  }

  if (chooseMatchingPersisted) {
    return isChooseMatchingChecked(chooseMatchingPersisted);
  }

  return selectCorrectPersisted
    ? isSelectCorrectLocked(selectCorrectPersisted)
    : false;
}

export function isRetryableStageDone(state: StageState): boolean {
  if (state.kind === "selectCorrect" || state.kind === "chooseMatching") {
    return isRetryableRetryDone(state);
  }

  return false;
}

export { isRetryableStageComplete };
