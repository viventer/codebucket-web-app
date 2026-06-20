"use client";

import { useCallback, useMemo, useState } from "react";

import type { MatchPairItemState } from "@/lib/exercises/item-glow-style";
import type { MatchPairsContent } from "@/schemas/courseSchema";

import type {
  CheckResult,
  ExerciseFeedback,
  MatchPairsExerciseController,
} from "./types";

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

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

function createSeededRandom(seed: number): () => number {
  let state = seed || 1;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function shuffleItemsSeeded<T>(items: T[], seed: string): T[] {
  const next = [...items];
  const random = createSeededRandom(hashString(seed));

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [next[i], next[j]] = [next[j]!, next[i]!];
  }

  return next;
}

function shuffleItemsRandom<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j]!, next[i]!];
  }
  return next;
}

function getRightColumnShuffleSeed(content: MatchPairsContent): string {
  return `${content.title}:${content.pairs.map((pair) => pair.right).join("|")}`;
}

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
  const leftItems = useMemo(() => buildItems(content, "left"), [content]);
  const shuffleSeed = getRightColumnShuffleSeed(content);
  const initialRightItems = useMemo(
    () => shuffleItemsSeeded(buildItems(content, "right"), shuffleSeed),
    [content, shuffleSeed],
  );

  const [rightItems, setRightItems] = useState(initialRightItems);
  const [selected, setSelected] = useState<MatchPairSelection | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [itemStates, setItemStates] = useState<
    Record<string, MatchPairItemState>
  >(() => createInitialItemStates(leftItems, initialRightItems));
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
    const shuffledRight = shuffleItemsRandom(buildItems(content, "right"));
    setRightItems(shuffledRight);
    setSelected(null);
    setMatchedPairIds(new Set());
    setErrorFlashIds(new Set());
    setItemStates(createInitialItemStates(leftItems, shuffledRight));
    setFeedbackState("idle");
    setIsComplete(false);
  }, [content, leftItems]);

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
