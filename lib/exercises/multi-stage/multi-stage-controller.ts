"use client";

import { useCallback, useMemo, useState } from "react";

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
  getSelectCorrectAnswerVisualState,
  getSelectCorrectWrongExplanation,
  isSelectCorrectComplete,
} from "../select-correct/select-correct-state";
import type {
  CheckResult,
  ExerciseFeedback,
  MultiStageExerciseController,
  StageProgress,
} from "../shared/types";

import {
  createAllStageStates,
  createStageState,
  EMPTY_FILL_GAPS_OPTIONS,
  EMPTY_SELECT_CORRECT_ANSWERS,
  type StageState,
} from "./stage-state";
import {
  deriveHasAttemptedCheck,
  deriveIsCurrentStageComplete,
  deriveMultiStageFeedback,
} from "./stage-view";
import {
  getStageActionBarVariant,
  isFillGapsStage,
  isSelectCorrectStage,
} from "./stage-utils";
import { useMultiStageWrongAnswerTimeout } from "./use-wrong-answer-timeout";

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

  const currentStage = content.stages[currentStageIndex]!;
  const currentState = stageStates[currentStageIndex]!;
  const totalStages = content.stages.length;
  const isLastStage = currentStageIndex === totalStages - 1;
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

  const stageProgress = useMemo<StageProgress>(
    () => ({
      current: currentStageIndex + 1,
      total: totalStages,
    }),
    [currentStageIndex, totalStages],
  );

  const feedbackTarget =
    fillGapsStage?.presentation
      ? getStageFeedbackTarget(fillGapsStage.presentation.kind)
      : "codePanel";

  const fillGapsAssignments =
    currentState.kind === "fillGaps" ? currentState.assignments : {};
  const fillGapsActiveGapId =
    currentState.kind === "fillGaps" ? currentState.activeGapId : null;

  const availableOptions = useMemo(
    () =>
      fillGapsStage
        ? getAvailableOptions(
            { ...fillGapsStage, options: optionOrder },
            fillGapsAssignments,
          )
        : [],
    [fillGapsAssignments, fillGapsStage, optionOrder],
  );

  const { clearWrongAnswerTimeout } = useMultiStageWrongAnswerTimeout(
    currentStageIndex,
    currentState,
    setStageStates,
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

  const selectAnswer = useCallback(
    (answerId: number) => {
      if (!selectCorrectStage || currentState.kind !== "selectCorrect") {
        return;
      }

      updateCurrentStageState((state) => {
        if (state.kind !== "selectCorrect") {
          return state;
        }

        return {
          ...state,
          selectCorrect: applySelectCorrectAnswer(
            state.selectCorrect,
            answerId,
            selectCorrectStage.correctAnswerId,
          ),
        };
      });
    },
    [currentState.kind, selectCorrectStage, updateCurrentStageState],
  );

  const selectOption = useCallback(
    (option: string) => {
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
    },
    [currentState.kind, fillGapsStage, updateCurrentStageState],
  );

  const clearGap = useCallback(
    (gapId: string) => {
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
    },
    [updateCurrentStageState],
  );

  const setActiveGapId = useCallback(
    (gapId: string | null) => {
      updateCurrentStageState((state) => {
        if (state.kind !== "fillGaps") {
          return state;
        }

        return {
          ...state,
          activeGapId: gapId,
        };
      });
    },
    [updateCurrentStageState],
  );

  const markAttempted = useCallback(() => {
    updateCurrentStageState((state) => {
      if (state.kind !== "fillGaps") {
        return state;
      }

      return {
        ...state,
        hasAttemptedCheck: true,
      };
    });
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
  }, [updateCurrentStageState]);

  const check = useCallback((): CheckResult => {
    if (currentState.kind === "selectCorrect") {
      return isSelectCorrectComplete(currentState.selectCorrect)
        ? "success"
        : "warning";
    }

    if (currentState.kind === "fillGaps" && fillGapsStage) {
      return evaluateFillGapsCheck(fillGapsStage, currentState.assignments);
    }

    return "warning";
  }, [currentState, fillGapsStage]);

  const applySolution = useCallback(() => {
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
  }, [currentState.kind, fillGapsStage, updateCurrentStageState]);

  const reset = useCallback(() => {
    clearWrongAnswerTimeout();

    setStageStates((prev) => {
      const next = [...prev];
      next[currentStageIndex] = createStageState(content.stages[currentStageIndex]!);
      return next;
    });

    if (currentState.kind === "fillGaps" || currentState.kind === "selectCorrect") {
      setShuffleTokens((prev) => {
        const next = [...prev];
        next[currentStageIndex] = (next[currentStageIndex] ?? 0) + 1;
        return next;
      });
    }
  }, [
    clearWrongAnswerTimeout,
    content.stages,
    currentStageIndex,
    currentState.kind,
  ]);

  const advanceStage = useCallback(() => {
    if (isLastStage) {
      return;
    }
    setCurrentStageIndex((index) => index + 1);
  }, [isLastStage]);

  const goToPreviousStage = useCallback(() => {
    if (currentStageIndex === 0) {
      return;
    }
    setCurrentStageIndex((index) => index - 1);
  }, [currentStageIndex]);

  const getHints = useCallback(() => hints, [hints]);

  const selectCorrectPersisted =
    currentState.kind === "selectCorrect" ? currentState.selectCorrect : null;

  const isCurrentStageComplete = useMemo(
    () => deriveIsCurrentStageComplete(currentState),
    [currentState],
  );

  const feedback = deriveMultiStageFeedback(currentState, selectCorrectPersisted);

  const hasAttemptedCheck = deriveHasAttemptedCheck(
    currentState,
    selectCorrectPersisted,
  );

  const getAnswerVisualState = useCallback(
    (answerId: number) => {
      if (!selectCorrectStage || !selectCorrectPersisted) {
        return "idle" as const;
      }

      return getSelectCorrectAnswerVisualState(
        selectCorrectPersisted,
        answerId,
        selectCorrectStage.correctAnswerId,
      );
    },
    [selectCorrectPersisted, selectCorrectStage],
  );

  const getWrongExplanation = useCallback(() => {
    if (!selectCorrectStage || !selectCorrectPersisted) {
      return null;
    }

    return getSelectCorrectWrongExplanation(
      selectCorrectPersisted,
      selectCorrectStage.answers,
      selectCorrectStage.correctAnswerId,
    );
  }, [selectCorrectPersisted, selectCorrectStage]);

  return {
    kind: "multiStage",
    content,
    currentStageIndex,
    currentStage,
    stageProgress,
    feedbackTarget,
    isLastStage,
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
