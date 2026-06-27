import {
  getMatchPairItemById,
  isMatchPairsComplete,
} from "../../match-pairs/match-pairs-state";
import type { MatchPairsColumn, MatchPairsItem } from "../../shared/types";

import type { MatchPairsStageState } from "../stage-state";

export const MATCH_PAIRS_ERROR_FLASH_MS = 600;

type MatchPairsStateUpdater = (
  updater: (state: MatchPairsStageState) => MatchPairsStageState,
) => void;

type SelectMatchPairItemParams = {
  column: MatchPairsColumn;
  id: string;
  state: MatchPairsStageState;
  leftItems: MatchPairsItem[];
  rightItems: MatchPairsItem[];
  allItems: MatchPairsItem[];
  pairCount: number;
  updateState: MatchPairsStateUpdater;
};

export function selectMatchPairItem({
  column,
  id,
  state,
  leftItems,
  rightItems,
  allItems,
  pairCount,
  updateState,
}: SelectMatchPairItemParams): void {
  if (state.isComplete) {
    return;
  }

  const item = allItems.find((entry) => entry.id === id);
  if (item && state.matchedPairIds.has(item.pairId)) {
    return;
  }

  if (!state.selected) {
    updateState((current) => ({
      ...current,
      selected: { column, id },
      itemStates: {
        ...current.itemStates,
        [id]: "selected",
      },
    }));
    return;
  }

  if (state.selected.column === column) {
    updateState((current) => {
      const nextItemStates = { ...current.itemStates };
      if (current.itemStates[current.selected!.id] === "selected") {
        nextItemStates[current.selected!.id] = "idle";
      }
      nextItemStates[id] = "selected";

      return {
        ...current,
        selected: { column, id },
        itemStates: nextItemStates,
      };
    });
    return;
  }

  const firstItem = getMatchPairItemById(
    state.selected.column === "left" ? leftItems : rightItems,
    state.selected.id,
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
    const nextMatched = new Set(state.matchedPairIds);
    nextMatched.add(firstItem.pairId);
    const allMatched = isMatchPairsComplete(nextMatched, pairCount);

    updateState((current) => ({
      ...current,
      matchedPairIds: nextMatched,
      selected: null,
      isComplete: allMatched,
      feedback: allMatched ? "success" : current.feedback,
      itemStates: {
        ...current.itemStates,
        [firstItem.id]: "correct",
        [secondItem.id]: "correct",
      },
    }));

    window.setTimeout(() => {
      updateState((current) => ({
        ...current,
        itemStates: {
          ...current.itemStates,
          [firstItem.id]: "matched",
          [secondItem.id]: "matched",
        },
      }));
    }, 300);

    return;
  }

  updateState((current) => {
    const nextErrorFlashIds = new Set(current.errorFlashIds);
    nextErrorFlashIds.add(firstItem.id);
    nextErrorFlashIds.add(secondItem.id);

    return {
      ...current,
      selected: null,
      errorFlashIds: nextErrorFlashIds,
      itemStates: {
        ...current.itemStates,
        [firstItem.id]: "idle",
        [secondItem.id]: "idle",
      },
    };
  });

  window.setTimeout(() => {
    updateState((current) => {
      const nextErrorFlashIds = new Set(current.errorFlashIds);
      nextErrorFlashIds.delete(firstItem.id);
      nextErrorFlashIds.delete(secondItem.id);

      return {
        ...current,
        errorFlashIds: nextErrorFlashIds,
      };
    });
  }, MATCH_PAIRS_ERROR_FLASH_MS);
}
