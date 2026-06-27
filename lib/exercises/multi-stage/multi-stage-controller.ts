"use client";

import { useCallback, useMemo } from "react";

import type { MultiStageContent } from "@/schemas/courseSchema";

import { getStageFeedbackTarget } from "../fill-gaps/fill-gaps-utils";
import type {
  CheckResult,
  ExerciseFeedback,
  MultiStageExerciseController,
} from "../shared/types";

import { useMultiStageDerived } from "./derived/use-multi-stage-derived";
import { useMultiStageFlow } from "./flow/use-multi-stage-flow";
import { resolveActiveStage } from "./resolve-active-stage";
import { useStageStates } from "./state/use-stage-states";
import {
  applyFillCodeStageSolution,
  applyFillGapsStageSolution,
} from "./stages/apply-stage-solution";
import {
  checkFillCodeStage,
  checkFillGapsStage,
  checkMatchPairsStage,
  checkSelectCorrectStage,
} from "./stages/stage-check";
import { useChooseMatchingStage } from "./stages/use-choose-matching-stage";
import { useFillCodeStage } from "./stages/use-fill-code-stage";
import { useFillGapsStage } from "./stages/use-fill-gaps-stage";
import { useMatchPairsStage } from "./stages/use-match-pairs-stage";
import { useSelectCorrectStage } from "./stages/use-select-correct-stage";
import {
  getStageActionBarVariant,
  isFillCodeStage,
  isFillGapsStage,
} from "./stage-utils";
import type { StageState } from "./stage-state";
import type { MultiStageCoreContext } from "./types";
import { useMultiStageWrongAnswerTimeout } from "./use-wrong-answer-timeout";

export function useMultiStageExerciseController(
  content: MultiStageContent,
  hints: string[],
): MultiStageExerciseController {
  const {
    stageStates,
    setStageStates,
    shuffleTokens,
    updateCurrentStageState: updateStageStateAtIndex,
    bumpShuffleToken,
    resetStageStates,
  } = useStageStates(content);

  const flow = useMultiStageFlow({
    content,
    stageStates,
    setStageStates,
    bumpShuffleToken,
  });

  const {
    currentStageIndex,
    currentStage,
    currentState,
    flowPhase,
    retryQueue,
    setRetryQueue,
    isLastStage,
    stageProgress,
    advanceStage,
    goToPreviousStage,
    resetFlow,
  } = flow;

  const shuffleToken = shuffleTokens[currentStageIndex] ?? 0;

  const updateCurrentStageState = useCallback(
    (updater: (state: StageState) => StageState) => {
      updateStageStateAtIndex(currentStageIndex, updater);
    },
    [currentStageIndex, updateStageStateAtIndex],
  );

  const coreContext = useMemo<MultiStageCoreContext>(
    () => ({
      content,
      currentStageIndex,
      currentStage,
      currentState,
      stageStates,
      shuffleToken,
      updateCurrentStageState,
      bumpShuffleToken,
      setRetryQueue,
    }),
    [
      content,
      currentStageIndex,
      currentStage,
      currentState,
      stageStates,
      shuffleToken,
      updateCurrentStageState,
      bumpShuffleToken,
      setRetryQueue,
    ],
  );

  const fillGapsSlice = useFillGapsStage(coreContext);
  const fillCodeSlice = useFillCodeStage(coreContext);
  const matchPairsSlice = useMatchPairsStage(coreContext);
  const selectCorrectSlice = useSelectCorrectStage(coreContext);
  const { stage: chooseMatchingSlice, checkChooseMatching } =
    useChooseMatchingStage(coreContext);

  const { clearWrongAnswerTimeout } = useMultiStageWrongAnswerTimeout(
    currentStageIndex,
    currentState,
    setStageStates,
    setRetryQueue,
  );

  const derived = useMultiStageDerived({
    currentState,
    stageStates,
    retryQueue,
    isLastStage,
  });

  const fillGapsStage =
    currentState.kind === "fillGaps" && isFillGapsStage(currentStage)
      ? currentStage
      : null;
  const fillCodeStage =
    currentState.kind === "fillCode" && isFillCodeStage(currentStage)
      ? currentStage
      : null;
  const gapLinesStage = fillGapsStage ?? fillCodeStage;

  const feedbackTarget = gapLinesStage?.presentation
    ? getStageFeedbackTarget(gapLinesStage.presentation.kind)
    : "codePanel";

  const currentStageActionBarVariant = getStageActionBarVariant(currentStage);

  const stage = resolveActiveStage(currentState, {
    fillGaps: fillGapsSlice,
    fillCode: fillCodeSlice,
    matchPairs: matchPairsSlice,
    selectCorrect: selectCorrectSlice,
    chooseMatching: chooseMatchingSlice,
  });

  function markAttempted() {
    updateCurrentStageState((state) => {
      if (state.kind === "fillGaps" || state.kind === "fillCode") {
        return {
          ...state,
          hasAttemptedCheck: true,
        };
      }

      return state;
    });
  }

  function setFeedback(next: ExerciseFeedback) {
    updateCurrentStageState((state) => ({
      ...state,
      feedback: next,
    }));
  }

  function clearTransientFeedback() {
    updateCurrentStageState((state) => {
      if (state.kind === "fillGaps" || state.kind === "fillCode") {
        return {
          ...state,
          feedback:
            state.feedback === "error" || state.feedback === "warning"
              ? "idle"
              : state.feedback,
        };
      }

      if (state.kind === "chooseMatching") {
        return {
          ...state,
          feedback:
            state.feedback === "error" || state.feedback === "warning"
              ? "idle"
              : state.feedback,
        };
      }

      return state;
    });
  }

  function check(): CheckResult {
    if (currentState.kind === "selectCorrect") {
      return checkSelectCorrectStage(currentState);
    }

    if (currentState.kind === "chooseMatching") {
      return checkChooseMatching();
    }

    if (currentState.kind === "matchPairs") {
      return checkMatchPairsStage(currentState);
    }

    if (currentState.kind === "fillGaps" && fillGapsStage) {
      return checkFillGapsStage(fillGapsStage, currentState);
    }

    if (currentState.kind === "fillCode" && fillCodeStage) {
      return checkFillCodeStage(fillCodeStage, currentState);
    }

    return "warning";
  }

  function applySolution() {
    if (fillGapsStage && currentState.kind === "fillGaps") {
      updateCurrentStageState((state) => {
        if (state.kind !== "fillGaps") {
          return state;
        }

        return applyFillGapsStageSolution(fillGapsStage, state);
      });
      return;
    }

    if (fillCodeStage && currentState.kind === "fillCode") {
      updateCurrentStageState((state) => {
        if (state.kind !== "fillCode") {
          return state;
        }

        return applyFillCodeStageSolution(fillCodeStage, state);
      });
    }
  }

  function reset() {
    clearWrongAnswerTimeout();
    resetFlow();
    resetStageStates();
  }

  function getHints() {
    return hints;
  }

  return {
    kind: "multiStage",
    content,
    navigation: {
      currentStageIndex,
      currentStage,
      flowPhase,
      stageProgress,
      isLastStage,
      advanceStage,
      goToPreviousStage,
    },
    session: {
      isExerciseComplete: derived.isExerciseComplete,
      isCurrentStageComplete: derived.isCurrentStageComplete,
      currentStageActionBarVariant,
      feedbackTarget,
    },
    stage,
    check,
    applySolution,
    reset,
    getHints,
    hasAttemptedCheck: derived.hasAttemptedCheck,
    feedback: derived.feedback,
    markAttempted,
    setFeedback,
    clearTransientFeedback,
  };
}
