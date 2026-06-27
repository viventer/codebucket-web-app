"use client";

import { useCallback } from "react";

import { useShuffledItems } from "@/lib/shuffle";

import {
  buildMatchPairItems,
  getMatchPairItemState,
} from "../../match-pairs/match-pairs-state";
import { selectMatchPairItem } from "../match-pairs/match-pairs-actions";
import { isMatchPairsStage } from "../stage-utils";
import type { MatchPairsStageState } from "../stage-state";
import type { MultiStageCoreContext, MultiStageMatchPairsStage } from "../types";

const EMPTY_MATCH_PAIRS_ITEMS: readonly {
  id: string;
  text: string;
  pairId: string;
}[] = [];

export function useMatchPairsStage(
  ctx: MultiStageCoreContext,
): MultiStageMatchPairsStage | null {
  const { currentStage, currentState, shuffleToken, updateCurrentStageState } =
    ctx;

  const matchPairsStage =
    currentState.kind === "matchPairs" && isMatchPairsStage(currentStage)
      ? currentStage
      : null;

  const matchPairsLeftSource = matchPairsStage
    ? buildMatchPairItems(matchPairsStage, "left")
    : EMPTY_MATCH_PAIRS_ITEMS;
  const matchPairsRightSource = matchPairsStage
    ? buildMatchPairItems(matchPairsStage, "right")
    : EMPTY_MATCH_PAIRS_ITEMS;

  const leftItems = useShuffledItems(
    matchPairsLeftSource,
    currentState.kind === "matchPairs" ? shuffleToken : 0,
  );
  const rightItems = useShuffledItems(
    matchPairsRightSource,
    currentState.kind === "matchPairs" ? shuffleToken : 0,
  );

  const matchPairsAllItems = [...leftItems, ...rightItems];

  const updateMatchPairsState = useCallback(
    (updater: (state: MatchPairsStageState) => MatchPairsStageState) => {
      updateCurrentStageState((state) => {
        if (state.kind !== "matchPairs") {
          return state;
        }

        return updater(state);
      });
    },
    [updateCurrentStageState],
  );

  const selectItem = useCallback(
    (column: "left" | "right", id: string) => {
      if (!matchPairsStage || currentState.kind !== "matchPairs") {
        return;
      }

      selectMatchPairItem({
        column,
        id,
        state: currentState,
        leftItems,
        rightItems,
        allItems: matchPairsAllItems,
        pairCount: matchPairsStage.pairs.length,
        updateState: updateMatchPairsState,
      });
    },
    [
      currentState,
      leftItems,
      matchPairsAllItems,
      matchPairsStage,
      rightItems,
      updateMatchPairsState,
    ],
  );

  const getItemState = useCallback(
    (itemId: string) => {
      if (currentState.kind !== "matchPairs") {
        return "idle" as const;
      }

      return getMatchPairItemState(
        itemId,
        matchPairsAllItems,
        currentState.matchedPairIds,
        currentState.itemStates,
      );
    },
    [currentState, matchPairsAllItems],
  );

  const isErrorFlashing = useCallback(
    (itemId: string) => {
      if (currentState.kind !== "matchPairs") {
        return false;
      }

      return currentState.errorFlashIds.has(itemId);
    },
    [currentState],
  );

  if (!matchPairsStage || currentState.kind !== "matchPairs") {
    return null;
  }

  return {
    type: "matchPairs",
    leftItems,
    rightItems,
    selected: currentState.selected,
    matchedPairIds: currentState.matchedPairIds,
    isComplete: currentState.isComplete,
    selectItem,
    getItemState,
    isErrorFlashing,
  };
}
