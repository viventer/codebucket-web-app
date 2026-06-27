import type { MatchPairItemState } from "../shared/item-glow-style";
import type { MatchPairsStage } from "@/schemas/courseSchema";

import type { MatchPairsColumn, MatchPairsItem } from "../shared/types";

export type MatchPairSelection = {
  column: MatchPairsColumn;
  id: string;
};

type MatchPairsLikeContent = Pick<MatchPairsStage, "pairs">;

export function buildMatchPairItems(
  content: MatchPairsLikeContent,
  column: MatchPairsColumn,
): MatchPairsItem[] {
  return content.pairs.map((pair, index) => ({
    id: `${column}-${index}`,
    text: column === "left" ? pair.left : pair.right,
    pairId: `pair-${index}`,
  }));
}

export function createInitialMatchPairItemStates(
  leftItems: MatchPairsItem[],
  rightItems: MatchPairsItem[],
): Record<string, MatchPairItemState> {
  const states: Record<string, MatchPairItemState> = {};
  for (const item of [...leftItems, ...rightItems]) {
    states[item.id] = "idle";
  }
  return states;
}

export function isMatchPairsComplete(
  matchedPairIds: Set<string>,
  pairCount: number,
): boolean {
  return matchedPairIds.size === pairCount;
}

export function getMatchPairItemById(
  items: MatchPairsItem[],
  id: string,
): MatchPairsItem | undefined {
  return items.find((item) => item.id === id);
}

export function getMatchPairItemState(
  itemId: string,
  allItems: MatchPairsItem[],
  matchedPairIds: Set<string>,
  itemStates: Record<string, MatchPairItemState>,
): MatchPairItemState {
  if (matchedPairIds.size > 0) {
    const item = allItems.find((entry) => entry.id === itemId);
    if (item && matchedPairIds.has(item.pairId)) {
      return itemStates[itemId] ?? "matched";
    }
  }
  return itemStates[itemId] ?? "idle";
}
