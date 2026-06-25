"use client";

import { useState } from "react";

import type { MatchPairItemState } from "../shared/item-glow-style";
import { useShuffledItems } from "@/lib/shuffle";
import type { MatchPairsContent } from "@/schemas/courseSchema";

import type {
  CheckResult,
  ExerciseFeedback,
  MatchPairsExerciseController,
} from "../shared/types";

import {
  buildMatchPairItems,
  createInitialMatchPairItemStates,
  getMatchPairItemById,
  getMatchPairItemState,
  isMatchPairsComplete,
} from "./match-pairs-state";

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

export function useMatchPairsExerciseController(
  content: MatchPairsContent,
): MatchPairsExerciseController {
  const leftSourceItems = buildMatchPairItems(content, "left");
  const rightSourceItems = buildMatchPairItems(content, "right");

  const [shuffleToken, setShuffleToken] = useState(0);
  const leftItems = useShuffledItems(leftSourceItems, shuffleToken);
  const rightItems = useShuffledItems(rightSourceItems, shuffleToken);

  const [selected, setSelected] = useState<MatchPairSelection | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [itemStates, setItemStates] = useState<
    Record<string, MatchPairItemState>
  >(() => createInitialMatchPairItemStates(leftSourceItems, rightSourceItems));
  const [errorFlashIds, setErrorFlashIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [feedback, setFeedbackState] = useState<ExerciseFeedback>("idle");
  const [isComplete, setIsComplete] = useState(false);

  const allItems = [...leftItems, ...rightItems];

  function flashError(ids: string[]) {
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
  }

  function isItemMatched(itemId: string): boolean {
    const item = allItems.find((entry) => entry.id === itemId);
    return item ? matchedPairIds.has(item.pairId) : false;
  }

  function selectItem(column: MatchPairColumn, id: string) {
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

    const firstItem = getMatchPairItemById(
      selected.column === "left" ? leftItems : rightItems,
      selected.id,
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
      const nextMatched = new Set(matchedPairIds);
      nextMatched.add(firstItem.pairId);

      setMatchedPairIds(nextMatched);
      setSelected(null);
      setItemStates((prev) => ({
        ...prev,
        [firstItem.id]: "correct",
        [secondItem.id]: "correct",
      }));

      if (isMatchPairsComplete(nextMatched, content.pairs.length)) {
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
  }

  function markAttempted() {}

  function setFeedback(next: ExerciseFeedback) {
    setFeedbackState(next);
  }

  function clearTransientFeedback() {
    setFeedbackState((current) =>
      current === "error" || current === "warning" ? "idle" : current,
    );
  }

  function check(): CheckResult {
    return isMatchPairsComplete(matchedPairIds, content.pairs.length)
      ? "success"
      : "warning";
  }

  function applySolution() {}

  function reset() {
    setShuffleToken((token) => token + 1);
    setSelected(null);
    setMatchedPairIds(new Set());
    setErrorFlashIds(new Set());
    setItemStates(createInitialMatchPairItemStates(leftSourceItems, rightSourceItems));
    setFeedbackState("idle");
    setIsComplete(false);
  }

  function getHints() {
    return [];
  }

  function getItemState(itemId: string): MatchPairItemState {
    return getMatchPairItemState(
      itemId,
      allItems,
      matchedPairIds,
      itemStates,
    );
  }

  function isErrorFlashing(itemId: string) {
    return errorFlashIds.has(itemId);
  }

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
