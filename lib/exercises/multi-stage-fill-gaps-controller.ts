"use client";

import { useCallback, useMemo, useState } from "react";

import { useShuffledItems } from "@/lib/shuffle";
import type { MultiStageFillGapsContent } from "@/schemas/courseSchema";

import {
  applyFillGapsSolution,
  createInitialAssignments,
  evaluateFillGapsCheck,
  getAvailableOptions,
  getFirstEmptyGapId,
  getGapIds,
  getStageFeedbackTarget,
} from "./fill-gaps-utils";
import type {
  CheckResult,
  ExerciseFeedback,
  MultiStageFillGapsExerciseController,
  StageProgress,
} from "./types";

type StageState = {
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  hasAttemptedCheck: boolean;
  feedback: ExerciseFeedback;
};

function createStageState(
  content: MultiStageFillGapsContent,
  stageIndex: number,
): StageState {
  const gapIds = getGapIds(content.stages[stageIndex]!);
  return {
    assignments: createInitialAssignments(gapIds),
    activeGapId: gapIds[0] ?? null,
    hasAttemptedCheck: false,
    feedback: "idle",
  };
}

function createAllStageStates(content: MultiStageFillGapsContent): StageState[] {
  return content.stages.map((_, index) => createStageState(content, index));
}

export function useMultiStageFillGapsExerciseController(
  content: MultiStageFillGapsContent,
  hints: string[],
): MultiStageFillGapsExerciseController {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageStates, setStageStates] = useState<StageState[]>(() =>
    createAllStageStates(content),
  );
  const [shuffleTokens, setShuffleTokens] = useState<number[]>(() =>
    content.stages.map(() => 0),
  );

  const currentStage = content.stages[currentStageIndex]!;
  const currentState = stageStates[currentStageIndex]!;
  const currentShuffleToken = shuffleTokens[currentStageIndex] ?? 0;
  const optionOrder = useShuffledItems(
    currentStage.options,
    currentShuffleToken,
  );
  const totalStages = content.stages.length;
  const isLastStage = currentStageIndex === totalStages - 1;

  const stageProgress = useMemo<StageProgress>(
    () => ({
      current: currentStageIndex + 1,
      total: totalStages,
    }),
    [currentStageIndex, totalStages],
  );

  const feedbackTarget = getStageFeedbackTarget(currentStage.presentation.kind);

  const availableOptions = useMemo(
    () =>
      getAvailableOptions(
        { ...currentStage, options: optionOrder },
        currentState.assignments,
      ),
    [currentStage, currentState.assignments, optionOrder],
  );

  const updateCurrentStageState = useCallback(
    (updater: (state: StageState) => StageState) => {
      setStageStates((prev) => {
        const next = [...prev];
        next[currentStageIndex] = updater(prev[currentStageIndex]!);
        return next;
      });
    },
    [currentStageIndex],
  );

  const selectOption = useCallback(
    (option: string) => {
      const gapIds = getGapIds(currentStage);
      updateCurrentStageState((state) => {
        if (!state.activeGapId) return state;

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
    },
    [currentStage, updateCurrentStageState],
  );

  const clearGap = useCallback(
    (gapId: string) => {
      updateCurrentStageState((state) => ({
        ...state,
        assignments: {
          ...state.assignments,
          [gapId]: null,
        },
        activeGapId: gapId,
      }));
    },
    [updateCurrentStageState],
  );

  const setActiveGapId = useCallback(
    (gapId: string | null) => {
      updateCurrentStageState((state) => ({
        ...state,
        activeGapId: gapId,
      }));
    },
    [updateCurrentStageState],
  );

  const markAttempted = useCallback(() => {
    updateCurrentStageState((state) => ({
      ...state,
      hasAttemptedCheck: true,
    }));
  }, [updateCurrentStageState]);

  const setFeedback = useCallback(
    (next: ExerciseFeedback) => {
      updateCurrentStageState((state) => ({
        ...state,
        feedback: next,
      }));
    },
    [updateCurrentStageState],
  );

  const clearTransientFeedback = useCallback(() => {
    updateCurrentStageState((state) => ({
      ...state,
      feedback:
        state.feedback === "error" || state.feedback === "warning"
          ? "idle"
          : state.feedback,
    }));
  }, [updateCurrentStageState]);

  const check = useCallback((): CheckResult => {
    return evaluateFillGapsCheck(currentStage, currentState.assignments);
  }, [currentStage, currentState.assignments]);

  const applySolution = useCallback(() => {
    updateCurrentStageState((state) => ({
      ...state,
      assignments: applyFillGapsSolution(currentStage, state.assignments),
      activeGapId: null,
    }));
  }, [currentStage, updateCurrentStageState]);

  const reset = useCallback(() => {
    setStageStates((prev) => {
      const next = [...prev];
      next[currentStageIndex] = createStageState(content, currentStageIndex);
      return next;
    });
    setShuffleTokens((prev) => {
      const next = [...prev];
      next[currentStageIndex] = (next[currentStageIndex] ?? 0) + 1;
      return next;
    });
  }, [content, currentStageIndex]);

  const advanceStage = useCallback(() => {
    if (isLastStage) return;
    setCurrentStageIndex((index) => index + 1);
  }, [isLastStage]);

  const goToPreviousStage = useCallback(() => {
    if (currentStageIndex === 0) return;
    setCurrentStageIndex((index) => index - 1);
  }, [currentStageIndex]);

  const getHints = useCallback(() => hints, [hints]);

  return {
    kind: "multiStageFillGaps",
    content,
    currentStageIndex,
    currentStage,
    stageProgress,
    feedbackTarget,
    isLastStage,
    assignments: currentState.assignments,
    activeGapId: currentState.activeGapId,
    availableOptions,
    selectOption,
    clearGap,
    setActiveGapId,
    advanceStage,
    goToPreviousStage,
    check,
    applySolution,
    reset,
    getHints,
    hasAttemptedCheck: currentState.hasAttemptedCheck,
    feedback: currentState.feedback,
    markAttempted,
    setFeedback,
    clearTransientFeedback,
  };
}
