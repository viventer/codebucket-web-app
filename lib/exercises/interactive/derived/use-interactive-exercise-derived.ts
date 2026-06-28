"use client";

import {
  deriveHasAttemptedCheck,
  deriveIsCurrentStageComplete,
  deriveIsExerciseComplete,
  deriveInteractiveExerciseFeedback,
  isRetryableStageDone,
} from "../stage-view";
import type { StageState } from "../stage-state";

type UseInteractiveExerciseDerivedParams = {
  currentState: StageState;
  stageStates: StageState[];
  retryQueue: number[];
  isLastStage: boolean;
};

export function useInteractiveExerciseDerived({
  currentState,
  stageStates,
  retryQueue,
  isLastStage,
}: UseInteractiveExerciseDerivedParams) {
  const selectCorrectPersisted =
    currentState.kind === "selectCorrect" ? currentState.selectCorrect : null;

  const chooseMatchingPersisted =
    currentState.kind === "chooseMatching" ? currentState.chooseMatching : null;

  const isCurrentStageComplete = deriveIsCurrentStageComplete(currentState);

  let isExerciseComplete = deriveIsExerciseComplete(stageStates);
  if (retryQueue.length > 0) {
    const allRetriesDone = retryQueue.every((stageIndex) => {
      const stageState = stageStates[stageIndex];
      return stageState !== undefined && isRetryableStageDone(stageState);
    });

    if (!allRetriesDone) {
      isExerciseComplete = false;
    }
  }

  const feedback = deriveInteractiveExerciseFeedback(
    currentState,
    selectCorrectPersisted,
    chooseMatchingPersisted,
    isLastStage,
  );

  const hasAttemptedCheck = deriveHasAttemptedCheck(
    currentState,
    selectCorrectPersisted,
    chooseMatchingPersisted,
  );

  return {
    selectCorrectPersisted,
    chooseMatchingPersisted,
    isCurrentStageComplete,
    isExerciseComplete,
    feedback,
    hasAttemptedCheck,
  };
}
