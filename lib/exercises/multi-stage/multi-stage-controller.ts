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
  buildMatchPairItems,
  getMatchPairItemById,
  getMatchPairItemState,
  isMatchPairsComplete,
} from "../match-pairs/match-pairs-state";
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
  isFillCodeStage,
  isFillGapsStage,
  isMatchPairsStage,
  isSelectCorrectStage,
} from "./stage-utils";
import { useMultiStageWrongAnswerTimeout } from "./use-wrong-answer-timeout";

const MATCH_PAIRS_ERROR_FLASH_MS = 600;

const EMPTY_MATCH_PAIRS_ITEMS: readonly { id: string; text: string; pairId: string }[] =
  [];

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

  const fillCodeStage =
    currentState.kind === "fillCode" && isFillCodeStage(currentStage)
      ? currentStage
      : null;

  const gapLinesStage = fillGapsStage ?? fillCodeStage;

  const matchPairsStage =
    currentState.kind === "matchPairs" && isMatchPairsStage(currentStage)
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

  const matchPairsLeftSource = matchPairsStage
    ? buildMatchPairItems(matchPairsStage, "left")
    : EMPTY_MATCH_PAIRS_ITEMS;
  const matchPairsRightSource = matchPairsStage
    ? buildMatchPairItems(matchPairsStage, "right")
    : EMPTY_MATCH_PAIRS_ITEMS;

  const leftItems = useShuffledItems(
    matchPairsLeftSource,
    currentState.kind === "matchPairs" ? currentShuffleToken : 0,
  );
  const rightItems = useShuffledItems(
    matchPairsRightSource,
    currentState.kind === "matchPairs" ? currentShuffleToken : 0,
  );

  const matchPairsAllItems = [...leftItems, ...rightItems];

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
    gapLinesStage?.presentation
      ? getStageFeedbackTarget(gapLinesStage.presentation.kind)
      : "codePanel";

  const gapAssignments =
    currentState.kind === "fillGaps" || currentState.kind === "fillCode"
      ? currentState.assignments
      : {};
  const gapActiveGapId =
    currentState.kind === "fillGaps" || currentState.kind === "fillCode"
      ? currentState.activeGapId
      : null;

  const availableOptions = fillGapsStage
    ? getAvailableOptions(
        { ...fillGapsStage, options: optionOrder },
        currentState.kind === "fillGaps" ? currentState.assignments : {},
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

  function selectItem(column: "left" | "right", id: string) {
    if (!matchPairsStage || currentState.kind !== "matchPairs") {
      return;
    }

    if (currentState.isComplete) {
      return;
    }

    const item = matchPairsAllItems.find((entry) => entry.id === id);
    if (item && currentState.matchedPairIds.has(item.pairId)) {
      return;
    }

    if (!currentState.selected) {
      updateCurrentStageState((state) => {
        if (state.kind !== "matchPairs") {
          return state;
        }

        return {
          ...state,
          selected: { column, id },
          itemStates: {
            ...state.itemStates,
            [id]: "selected",
          },
        };
      });
      return;
    }

    if (currentState.selected.column === column) {
      updateCurrentStageState((state) => {
        if (state.kind !== "matchPairs") {
          return state;
        }

        const nextItemStates = { ...state.itemStates };
        if (state.itemStates[state.selected!.id] === "selected") {
          nextItemStates[state.selected!.id] = "idle";
        }
        nextItemStates[id] = "selected";

        return {
          ...state,
          selected: { column, id },
          itemStates: nextItemStates,
        };
      });
      return;
    }

    const firstItem = getMatchPairItemById(
      currentState.selected.column === "left" ? leftItems : rightItems,
      currentState.selected.id,
    );
    const secondItem = getMatchPairItemById(
      column === "left" ? leftItems : rightItems,
      id,
    );

    if (!firstItem || !secondItem) {
      return;
    }

    const isCorrect = firstItem.pairId === secondItem.pairId;

    if (isCorrect) {
      const nextMatched = new Set(currentState.matchedPairIds);
      nextMatched.add(firstItem.pairId);
      const allMatched = isMatchPairsComplete(
        nextMatched,
        matchPairsStage.pairs.length,
      );

      updateCurrentStageState((state) => {
        if (state.kind !== "matchPairs") {
          return state;
        }

        return {
          ...state,
          matchedPairIds: nextMatched,
          selected: null,
          isComplete: allMatched,
          feedback: allMatched ? "success" : state.feedback,
          itemStates: {
            ...state.itemStates,
            [firstItem.id]: "correct",
            [secondItem.id]: "correct",
          },
        };
      });

      window.setTimeout(() => {
        updateCurrentStageState((state) => {
          if (state.kind !== "matchPairs") {
            return state;
          }

          return {
            ...state,
            itemStates: {
              ...state.itemStates,
              [firstItem.id]: "matched",
              [secondItem.id]: "matched",
            },
          };
        });
      }, 300);

      return;
    }

    updateCurrentStageState((state) => {
      if (state.kind !== "matchPairs") {
        return state;
      }

      const nextErrorFlashIds = new Set(state.errorFlashIds);
      nextErrorFlashIds.add(firstItem.id);
      nextErrorFlashIds.add(secondItem.id);

      return {
        ...state,
        selected: null,
        errorFlashIds: nextErrorFlashIds,
        itemStates: {
          ...state.itemStates,
          [firstItem.id]: "idle",
          [secondItem.id]: "idle",
        },
      };
    });

    window.setTimeout(() => {
      updateCurrentStageState((state) => {
        if (state.kind !== "matchPairs") {
          return state;
        }

        const nextErrorFlashIds = new Set(state.errorFlashIds);
        nextErrorFlashIds.delete(firstItem.id);
        nextErrorFlashIds.delete(secondItem.id);

        return {
          ...state,
          errorFlashIds: nextErrorFlashIds,
        };
      });
    }, MATCH_PAIRS_ERROR_FLASH_MS);
  }

  function getItemState(itemId: string) {
    if (currentState.kind !== "matchPairs") {
      return "idle" as const;
    }

    return getMatchPairItemState(
      itemId,
      matchPairsAllItems,
      currentState.matchedPairIds,
      currentState.itemStates,
    );
  }

  function isErrorFlashing(itemId: string) {
    if (currentState.kind !== "matchPairs") {
      return false;
    }

    return currentState.errorFlashIds.has(itemId);
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

  function updateGap(gapId: string, value: string) {
    if (!fillCodeStage || currentState.kind !== "fillCode") {
      return;
    }

    updateCurrentStageState((state) => {
      if (state.kind !== "fillCode") {
        return state;
      }

      return {
        ...state,
        assignments: {
          ...state.assignments,
          [gapId]: value === "" ? null : value,
        },
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
      if (state.kind !== "fillGaps" && state.kind !== "fillCode") {
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
      if (state.kind !== "fillGaps" && state.kind !== "fillCode") {
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
      if (state.kind !== "fillGaps" && state.kind !== "fillCode") {
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

    if (currentState.kind === "matchPairs") {
      return currentState.isComplete ? "success" : "warning";
    }

    if (currentState.kind === "fillGaps" && fillGapsStage) {
      return evaluateFillGapsCheck(fillGapsStage, currentState.assignments);
    }

    if (currentState.kind === "fillCode" && fillCodeStage) {
      return evaluateFillGapsCheck(fillCodeStage, currentState.assignments, {
        caseInsensitive: true,
      });
    }

    return "warning";
  }

  function applySolution() {
    if (fillGapsStage && currentState.kind === "fillGaps") {
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
      return;
    }

    if (fillCodeStage && currentState.kind === "fillCode") {
      updateCurrentStageState((state) => {
        if (state.kind !== "fillCode") {
          return state;
        }

        return {
          ...state,
          assignments: applyFillGapsSolution(fillCodeStage, state.assignments),
          activeGapId: null,
        };
      });
    }
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

  const matchPairsSelected =
    currentState.kind === "matchPairs" ? currentState.selected : null;
  const matchPairsMatchedPairIds =
    currentState.kind === "matchPairs"
      ? currentState.matchedPairIds
      : new Set<string>();
  const matchPairsIsComplete =
    currentState.kind === "matchPairs" ? currentState.isComplete : false;

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
    assignments: gapAssignments,
    activeGapId: gapActiveGapId,
    availableOptions,
    updateGap,
    selectOption,
    clearGap,
    setActiveGapId,
    leftItems,
    rightItems,
    selected: matchPairsSelected,
    matchedPairIds: matchPairsMatchedPairIds,
    isComplete: matchPairsIsComplete,
    selectItem,
    getItemState,
    isErrorFlashing,
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
