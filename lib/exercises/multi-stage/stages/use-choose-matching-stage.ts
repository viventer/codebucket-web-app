"use client";

import { useShuffledItems } from "@/lib/shuffle";

import {
  applyChooseMatchingCheck,
  getChooseMatchingItemVisualState,
  isChooseMatchingAnswerCorrect,
  toggleItemSelection,
} from "../../choose-matching/choose-matching-state";
import type { CheckResult } from "../../shared/types";
import { EMPTY_CHOOSE_MATCHING_ITEMS } from "../stage-state";
import { isChooseMatchingStage } from "../stage-utils";
import type { MultiStageCoreContext, MultiStageChooseMatchingStage } from "../types";

export function useChooseMatchingStage(
  ctx: MultiStageCoreContext,
): {
  stage: MultiStageChooseMatchingStage | null;
  checkChooseMatching: () => CheckResult;
} {
  const {
    currentStage,
    currentState,
    currentStageIndex,
    shuffleToken,
    updateCurrentStageState,
    setRetryQueue,
  } = ctx;

  const chooseMatchingStage =
    currentState.kind === "chooseMatching" &&
    isChooseMatchingStage(currentStage)
      ? currentStage
      : null;

  const shuffledItems = useShuffledItems(
    chooseMatchingStage?.items ?? EMPTY_CHOOSE_MATCHING_ITEMS,
    currentState.kind === "chooseMatching" ? shuffleToken : 0,
  );

  function toggleItem(itemId: number) {
    if (!chooseMatchingStage || currentState.kind !== "chooseMatching") {
      return;
    }

    updateCurrentStageState((state) => {
      if (state.kind !== "chooseMatching") {
        return state;
      }

      return {
        ...state,
        chooseMatching: toggleItemSelection(state.chooseMatching, itemId),
      };
    });
  }

  function getItemVisualState(itemId: number) {
    if (!chooseMatchingStage || currentState.kind !== "chooseMatching") {
      return "idle" as const;
    }

    return getChooseMatchingItemVisualState(
      currentState.chooseMatching,
      itemId,
      chooseMatchingStage.correctItemIds,
    );
  }

  function checkChooseMatching(): CheckResult {
    if (!chooseMatchingStage || currentState.kind !== "chooseMatching") {
      return "warning";
    }

    const { chooseMatching } = currentState;

    if (chooseMatching.phase !== "idle") {
      return isChooseMatchingAnswerCorrect(
        chooseMatching.selectedIds,
        chooseMatchingStage.correctItemIds,
      )
        ? "success"
        : "error";
    }

    if (chooseMatching.selectedIds.length === 0) {
      return "warning";
    }

    const nextChooseMatching = applyChooseMatchingCheck(
      chooseMatching,
      chooseMatchingStage.correctItemIds,
    );
    const isCorrect = nextChooseMatching.phase === "correct";

    updateCurrentStageState((state) => {
      if (state.kind !== "chooseMatching") {
        return state;
      }

      const retryCompleted =
        nextChooseMatching.attempt === "retry" &&
        (nextChooseMatching.phase === "correct" ||
          nextChooseMatching.phase === "wrongResolved")
          ? true
          : state.retryCompleted;

      return {
        ...state,
        chooseMatching: nextChooseMatching,
        firstAttemptWrong:
          nextChooseMatching.attempt === "first" &&
          nextChooseMatching.phase === "wrongDeferred"
            ? true
            : state.firstAttemptWrong,
        retryCompleted,
        feedback: isCorrect ? "stageSuccess" : "stageCloseCall",
      };
    });

    if (
      !isCorrect &&
      nextChooseMatching.attempt === "first" &&
      nextChooseMatching.phase === "wrongDeferred"
    ) {
      setRetryQueue((prev) =>
        prev.includes(currentStageIndex)
          ? prev
          : [...prev, currentStageIndex].sort((a, b) => a - b),
      );
    }

    return isCorrect ? "success" : "error";
  }

  if (!chooseMatchingStage || currentState.kind !== "chooseMatching") {
    return {
      stage: null,
      checkChooseMatching: () => "warning" as const,
    };
  }

  return {
    stage: {
      type: "chooseMatching",
      command: chooseMatchingStage.command ?? ctx.content.command,
      persisted: currentState.chooseMatching,
      shuffledItems,
      toggleItem,
      getItemVisualState,
    },
    checkChooseMatching,
  };
}
