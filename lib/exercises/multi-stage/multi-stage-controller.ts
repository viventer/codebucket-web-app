"use client";

import { useState } from "react";

import { useShuffledItems } from "@/lib/shuffle";
import type { MultiStageContent } from "@/schemas/courseSchema";

import {
  applyFillGapsSolution,
  evaluateFillGapsCheck,
  getAvailableOptions,
  getFirstEmptyGapId,
  getGapIds,
  getStageFeedbackTarget,
} from "../fill-gaps/fill-gaps-utils";
import {
  applySelectCorrectAnswer,
  createInitialSelectCorrectRetryState,
  getSelectCorrectAnswerVisualState,
  getSelectCorrectWrongExplanation,
  isSelectCorrectComplete,
} from "../select-correct/select-correct-state";
import type {
  CheckResult,
  ExerciseFeedback,
  MultiStageExerciseController,
  MultiStageFlowPhase,
  StageProgress,
} from "../shared/types";

import {
  createAllStageStates,
  EMPTY_FILL_GAPS_OPTIONS,
  EMPTY_SELECT_CORRECT_ANSWERS,
  type SelectCorrectStageState,
  type StageState,
} from "./stage-state";
import {
  deriveHasAttemptedCheck,
  deriveIsCurrentStageComplete,
  deriveIsExerciseComplete,
  deriveMultiStageFeedback,
} from "./stage-view";
import {
  getStageActionBarVariant,
  isFillGapsStage,
  isSelectCorrectStage,
} from "./stage-utils";
import { useMultiStageWrongAnswerTimeout } from "./use-wrong-answer-timeout";

function prepareRetryStageState(state: SelectCorrectStageState): SelectCorrectStageState {
  return {
    ...state,
    selectCorrect: createInitialSelectCorrectRetryState(),
    feedback: "idle",
  };
}

export function useMultiStageExerciseController(
  content: MultiStageContent,
  hints: string[],
): MultiStageExerciseController {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageStates, setStageStates] = useState<StageState[]>(() =>
    createAllStageStates(content),
  );
  const [shuffleTokens, setShuffleTokens] = useState<number[]>(() =>
    content.stages.map(() => 0),
  );
  const [flowPhase, setFlowPhase] = useState<MultiStageFlowPhase>("main");
  const [retryQueue, setRetryQueue] = useState<number[]>([]);
  const [retryQueueIndex, setRetryQueueIndex] = useState(0);

  const currentStage = content.stages[currentStageIndex]!;
  const currentState = stageStates[currentStageIndex]!;
  const totalStages = content.stages.length;
  const isLastMainStage = currentStageIndex === totalStages - 1;
  const isLastStage =
    flowPhase === "retry"
      ? retryQueueIndex === retryQueue.length - 1
      : isLastMainStage && retryQueue.length === 0;
  const currentStageActionBarVariant = getStageActionBarVariant(currentStage);

  const fillGapsStage =
    currentState.kind === "fillGaps" && isFillGapsStage(currentStage)
      ? currentStage
      : null;

  const selectCorrectStage =
    currentState.kind === "selectCorrect" && isSelectCorrectStage(currentStage)
      ? currentStage
      : null;

  const currentShuffleToken = shuffleTokens[currentStageIndex] ?? 0;

  const optionOrder = useShuffledItems(
    fillGapsStage?.options ?? EMPTY_FILL_GAPS_OPTIONS,
    currentState.kind === "fillGaps" ? currentShuffleToken : 0,
  );

  const shuffledSelectCorrectAnswers = useShuffledItems(
    selectCorrectStage?.answers ?? EMPTY_SELECT_CORRECT_ANSWERS,
    currentState.kind === "selectCorrect" ? currentShuffleToken : 0,
  );

  const stageProgress: StageProgress =
    flowPhase === "retry"
      ? {
          current: retryQueueIndex + 1,
          total: retryQueue.length,
        }
      : {
          current: currentStageIndex + 1,
          total: totalStages,
        };

  const feedbackTarget =
    fillGapsStage?.presentation
      ? getStageFeedbackTarget(fillGapsStage.presentation.kind)
      : "codePanel";

  const fillGapsAssignments =
    currentState.kind === "fillGaps" ? currentState.assignments : {};
  const fillGapsActiveGapId =
    currentState.kind === "fillGaps" ? currentState.activeGapId : null;

  const availableOptions = fillGapsStage
    ? getAvailableOptions(
        { ...fillGapsStage, options: optionOrder },
        fillGapsAssignments,
      )
    : [];

  const { clearWrongAnswerTimeout } = useMultiStageWrongAnswerTimeout(
    currentStageIndex,
    currentState,
    setStageStates,
    setRetryQueue,
  );

  function enterRetryStage(stageIndex: number, queueIndex: number) {
    setFlowPhase("retry");
    setRetryQueueIndex(queueIndex);
    setCurrentStageIndex(stageIndex);

    setStageStates((prev) => {
      const next = [...prev];
      const stageState = next[stageIndex];
      if (stageState?.kind !== "selectCorrect") {
        return prev;
      }

      next[stageIndex] = prepareRetryStageState(stageState);
      return next;
    });

    setShuffleTokens((prev) => {
      const next = [...prev];
      next[stageIndex] = (next[stageIndex] ?? 0) + 1;
      return next;
    });
  }

  function startRetryPhase() {
    const firstRetryStage = retryQueue[0];
    if (firstRetryStage === undefined) {
      return;
    }

    enterRetryStage(firstRetryStage, 0);
  }

  function updateCurrentStageState(updater: (state: StageState) => StageState) {
    setStageStates((prev) => {
      const next = [...prev];
      next[currentStageIndex] = updater(prev[currentStageIndex]!);
      return next;
    });
  }

  function selectAnswer(answerId: number) {
    if (!selectCorrectStage || currentState.kind !== "selectCorrect") {
      return;
    }

    updateCurrentStageState((state) => {
      if (state.kind !== "selectCorrect") {
        return state;
      }

      const selectCorrect = applySelectCorrectAnswer(
        state.selectCorrect,
        answerId,
        selectCorrectStage.correctAnswerId,
      );

      const retryCompleted =
        selectCorrect.attempt === "retry" && selectCorrect.phase === "correct"
          ? true
          : state.retryCompleted;

      return {
        ...state,
        selectCorrect,
        retryCompleted,
      };
    });
  }

  function selectOption(option: string) {
    if (!fillGapsStage || currentState.kind !== "fillGaps") {
      return;
    }

    const gapIds = getGapIds(fillGapsStage);
    updateCurrentStageState((state) => {
      if (state.kind !== "fillGaps" || !state.activeGapId) {
        return state;
      }

      const assignments = {
        ...state.assignments,
        [state.activeGapId]: option,
      };

      return {
        ...state,
        assignments,
        activeGapId: getFirstEmptyGapId(gapIds, assignments),
      };
    });
  }

  function clearGap(gapId: string) {
    updateCurrentStageState((state) => {
      if (state.kind !== "fillGaps") {
        return state;
      }

      return {
        ...state,
        assignments: {
          ...state.assignments,
          [gapId]: null,
        },
        activeGapId: gapId,
      };
    });
  }

  function setActiveGapId(gapId: string | null) {
    updateCurrentStageState((state) => {
      if (state.kind !== "fillGaps") {
        return state;
      }

      return {
        ...state,
        activeGapId: gapId,
      };
    });
  }

  function markAttempted() {
    updateCurrentStageState((state) => {
      if (state.kind !== "fillGaps") {
        return state;
      }

      return {
        ...state,
        hasAttemptedCheck: true,
      };
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
      if (state.kind !== "fillGaps") {
        return state;
      }

      return {
        ...state,
        feedback:
          state.feedback === "error" || state.feedback === "warning"
            ? "idle"
            : state.feedback,
      };
    });
  }

  function check(): CheckResult {
    if (currentState.kind === "selectCorrect") {
      return isSelectCorrectComplete(currentState.selectCorrect)
        ? "success"
        : "warning";
    }

    if (currentState.kind === "fillGaps" && fillGapsStage) {
      return evaluateFillGapsCheck(fillGapsStage, currentState.assignments);
    }

    return "warning";
  }

  function applySolution() {
    if (!fillGapsStage || currentState.kind !== "fillGaps") {
      return;
    }

    updateCurrentStageState((state) => {
      if (state.kind !== "fillGaps") {
        return state;
      }

      return {
        ...state,
        assignments: applyFillGapsSolution(fillGapsStage, state.assignments),
        activeGapId: null,
      };
    });
  }

  function reset() {
    clearWrongAnswerTimeout();
    setCurrentStageIndex(0);
    setStageStates(createAllStageStates(content));
    setShuffleTokens(content.stages.map(() => 0));
    setFlowPhase("main");
    setRetryQueue([]);
    setRetryQueueIndex(0);
  }

  function advanceStage() {
    if (flowPhase === "retry") {
      if (retryQueueIndex < retryQueue.length - 1) {
        const nextQueueIndex = retryQueueIndex + 1;
        const nextStageIndex = retryQueue[nextQueueIndex]!;
        enterRetryStage(nextStageIndex, nextQueueIndex);
      }
      return;
    }

    if (currentStageIndex < totalStages - 1) {
      setCurrentStageIndex((index) => index + 1);
      return;
    }

    if (retryQueue.length > 0) {
      startRetryPhase();
    }
  }

  function goToPreviousStage() {
    if (flowPhase === "retry" || currentStageIndex === 0) {
      return;
    }
    setCurrentStageIndex((index) => index - 1);
  }

  function getHints() {
    return hints;
  }

  const selectCorrectPersisted =
    currentState.kind === "selectCorrect" ? currentState.selectCorrect : null;

  const isCurrentStageComplete = deriveIsCurrentStageComplete(currentState);

  let isExerciseComplete = deriveIsExerciseComplete(stageStates);
  if (retryQueue.length > 0) {
    const allRetriesDone = retryQueue.every((stageIndex) => {
      const stageState = stageStates[stageIndex];
      return (
        stageState?.kind === "selectCorrect" && stageState.retryCompleted
      );
    });

    if (!allRetriesDone) {
      isExerciseComplete = false;
    }
  }

  const feedback = deriveMultiStageFeedback(
    currentState,
    selectCorrectPersisted,
    isLastStage,
  );

  const hasAttemptedCheck = deriveHasAttemptedCheck(
    currentState,
    selectCorrectPersisted,
  );

  function getAnswerVisualState(answerId: number) {
    if (!selectCorrectStage || !selectCorrectPersisted) {
      return "idle" as const;
    }

    return getSelectCorrectAnswerVisualState(
      selectCorrectPersisted,
      answerId,
      selectCorrectStage.correctAnswerId,
    );
  }

  function getWrongExplanation() {
    if (!selectCorrectStage || !selectCorrectPersisted) {
      return null;
    }

    return getSelectCorrectWrongExplanation(
      selectCorrectPersisted,
      selectCorrectStage.answers,
      selectCorrectStage.correctAnswerId,
    );
  }

  return {
    kind: "multiStage",
    content,
    currentStageIndex,
    currentStage,
    stageProgress,
    feedbackTarget,
    flowPhase,
    isLastStage,
    isExerciseComplete,
    currentStageActionBarVariant,
    isCurrentStageComplete,
    assignments: fillGapsAssignments,
    activeGapId: fillGapsActiveGapId,
    availableOptions,
    selectOption,
    clearGap,
    setActiveGapId,
    selectCorrectPersisted,
    shuffledSelectCorrectAnswers,
    selectAnswer,
    getAnswerVisualState,
    getWrongExplanation,
    advanceStage,
    goToPreviousStage,
    check,
    applySolution,
    reset,
    getHints,
    hasAttemptedCheck,
    feedback,
    markAttempted,
    setFeedback,
    clearTransientFeedback,
  };
}
