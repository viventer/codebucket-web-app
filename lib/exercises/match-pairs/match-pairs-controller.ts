"use client";

import { useCallback, useMemo, useState } from "react";

import type { MatchPairItemState } from "../shared/item-glow-style";
import { useShuffledItems } from "@/lib/shuffle";
import type { MatchPairsContent } from "@/schemas/courseSchema";

import type {
  CheckResult,
  ExerciseFeedback,
  MatchPairsExerciseController,
} from "../shared/types";

const ERROR_FLASH_MS = 600;

export type MatchPairColumn = "left" | "right";

export type MatchPairItem = {
  id: string;
  text: string;
  pairId: string;
};

export type MatchPairSelection = {
  column: MatchPairColumn;
  id: string;
};

function buildItems(
  content: MatchPairsContent,
  column: MatchPairColumn,
): MatchPairItem[] {
  return content.pairs.map((pair, index) => ({
    id: `${column}-${index}`,
    text: column === "left" ? pair.left : pair.right,
    pairId: `pair-${index}`,
  }));
}

function createInitialItemStates(
  leftItems: MatchPairItem[],
  rightItems: MatchPairItem[],
): Record<string, MatchPairItemState> {
  const states: Record<string, MatchPairItemState> = {};
  for (const item of [...leftItems, ...rightItems]) {
    states[item.id] = "idle";
  }
  return states;
}

export function useMatchPairsExerciseController(
  content: MatchPairsContent,
): MatchPairsExerciseController {
  const leftSourceItems = useMemo(
    () => buildItems(content, "left"),
    [content],
  );
  const rightSourceItems = useMemo(
    () => buildItems(content, "right"),
    [content],
  );

  const [shuffleToken, setShuffleToken] = useState(0);
  const leftItems = useShuffledItems(leftSourceItems, shuffleToken);
  const rightItems = useShuffledItems(rightSourceItems, shuffleToken);

  const [selected, setSelected] = useState<MatchPairSelection | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [itemStates, setItemStates] = useState<
    Record<string, MatchPairItemState>
  >(() => createInitialItemStates(leftSourceItems, rightSourceItems));
  const [errorFlashIds, setErrorFlashIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [feedback, setFeedbackState] = useState<ExerciseFeedback>("idle");
  const [isComplete, setIsComplete] = useState(false);

  const allItems = useMemo(
    () => [...leftItems, ...rightItems],
    [leftItems, rightItems],
  );

  const flashError = useCallback((ids: string[]) => {
    setErrorFlashIds((prev) => new Set([...prev, ...ids]));

    window.setTimeout(() => {
      setErrorFlashIds((prev) => {
        const next = new Set(prev);
        for (const id of ids) {
          next.delete(id);
        }
        return next;
      });
    }, ERROR_FLASH_MS);
  }, []);

  const getItemById = useCallback(
    (column: MatchPairColumn, id: string): MatchPairItem | undefined => {
      const items = column === "left" ? leftItems : rightItems;
      return items.find((item) => item.id === id);
    },
    [leftItems, rightItems],
  );

  const isItemMatched = useCallback(
    (itemId: string): boolean => {
      const item = allItems.find((entry) => entry.id === itemId);
      return item ? matchedPairIds.has(item.pairId) : false;
    },
    [allItems, matchedPairIds],
  );

  const selectItem = useCallback(
    (column: MatchPairColumn, id: string) => {
      if (isComplete) {
        return;
      }

      if (isItemMatched(id)) {
        return;
      }

      if (!selected) {
        setSelected({ column, id });
        setItemStates((prev) => ({
          ...prev,
          [id]: "selected",
        }));
        return;
      }

      if (selected.column === column) {
        setItemStates((prev) => {
          const next = { ...prev };
          if (prev[selected.id] === "selected") {
            next[selected.id] = "idle";
          }
          next[id] = "selected";
          return next;
        });
        setSelected({ column, id });
        return;
      }

      const firstItem = getItemById(selected.column, selected.id);
      const secondItem = getItemById(column, id);

      if (!firstItem || !secondItem) {
        return;
      }

      const isCorrect = firstItem.pairId === secondItem.pairId;

      if (isCorrect) {
        const nextMatched = new Set(matchedPairIds);
        nextMatched.add(firstItem.pairId);

        setMatchedPairIds(nextMatched);
        setSelected(null);
        setItemStates((prev) => ({
          ...prev,
          [firstItem.id]: "correct",
          [secondItem.id]: "correct",
        }));

        if (nextMatched.size === content.pairs.length) {
          setIsComplete(true);
          setFeedbackState("success");
        }

        window.setTimeout(() => {
          setItemStates((prev) => ({
            ...prev,
            [firstItem.id]: "matched",
            [secondItem.id]: "matched",
          }));
        }, 300);

        return;
      }

      setSelected(null);
      setItemStates((prev) => ({
        ...prev,
        [firstItem.id]: "idle",
        [secondItem.id]: "idle",
      }));
      flashError([firstItem.id, secondItem.id]);
    },
    [
      content.pairs.length,
      flashError,
      getItemById,
      isComplete,
      isItemMatched,
      matchedPairIds,
      selected,
    ],
  );

  const markAttempted = useCallback(() => {}, []);

  const setFeedback = useCallback((next: ExerciseFeedback) => {
    setFeedbackState(next);
  }, []);

  const clearTransientFeedback = useCallback(() => {
    setFeedbackState((current) =>
      current === "error" || current === "warning" ? "idle" : current,
    );
  }, []);

  const check = useCallback((): CheckResult => {
    return matchedPairIds.size === content.pairs.length ? "success" : "warning";
  }, [content.pairs.length, matchedPairIds.size]);

  const applySolution = useCallback(() => {}, []);

  const reset = useCallback(() => {
    setShuffleToken((token) => token + 1);
    setSelected(null);
    setMatchedPairIds(new Set());
    setErrorFlashIds(new Set());
    setItemStates(createInitialItemStates(leftSourceItems, rightSourceItems));
    setFeedbackState("idle");
    setIsComplete(false);
  }, [leftSourceItems, rightSourceItems]);

  const getHints = useCallback(() => [], []);

  const getItemState = useCallback(
    (itemId: string): MatchPairItemState => {
      if (matchedPairIds.size > 0) {
        const item = allItems.find((entry) => entry.id === itemId);
        if (item && matchedPairIds.has(item.pairId)) {
          return itemStates[itemId] ?? "matched";
        }
      }
      return itemStates[itemId] ?? "idle";
    },
    [allItems, itemStates, matchedPairIds],
  );

  const isErrorFlashing = useCallback(
    (itemId: string) => errorFlashIds.has(itemId),
    [errorFlashIds],
  );

  return {
    kind: "matchPairs",
    leftItems,
    rightItems,
    selected,
    matchedPairIds,
    isComplete,
    selectItem,
    getItemState,
    isErrorFlashing,
    check,
    applySolution,
    reset,
    getHints,
    hasAttemptedCheck: false,
    feedback,
    markAttempted,
    setFeedback,
    clearTransientFeedback,
  };
}
