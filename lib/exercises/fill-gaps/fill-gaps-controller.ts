"use client";

import { useState } from "react";

import { useShuffledItems } from "@/lib/shuffle";
import type { FillGapsContent } from "@/schemas/courseSchema";

import {
  applyFillGapsSolution,
  createInitialAssignments,
  evaluateFillGapsCheck,
  getAvailableOptions,
  getFirstEmptyGapId,
  getGapIds,
} from "./fill-gaps-utils";
import type {
  CheckResult,
  ExerciseFeedback,
  FillGapsExerciseController,
} from "../shared/types";

export function useFillGapsExerciseController(
  content: FillGapsContent,
  hints: string[],
): FillGapsExerciseController {
  const gapIds = getGapIds(content);
  const initialAssignments = createInitialAssignments(gapIds);

  const [assignments, setAssignments] =
    useState<Record<string, string | null>>(initialAssignments);
  const [activeGapId, setActiveGapId] = useState<string | null>(
    gapIds[0] ?? null,
  );
  const [hasAttemptedCheck, setHasAttemptedCheck] = useState(false);
  const [feedback, setFeedbackState] = useState<ExerciseFeedback>("idle");
  const [shuffleToken, setShuffleToken] = useState(0);

  const optionOrder = useShuffledItems(content.options, shuffleToken);

  const availableOptions = getAvailableOptions(
    { ...content, options: optionOrder },
    assignments,
  );

  function selectOption(option: string) {
    if (!activeGapId) return;

    setAssignments((prev) => {
      const next = {
        ...prev,
        [activeGapId]: option,
      };
      setActiveGapId(getFirstEmptyGapId(gapIds, next));
      return next;
    });
  }

  function clearGap(gapId: string) {
    setAssignments((prev) => ({
      ...prev,
      [gapId]: null,
    }));
    setActiveGapId(gapId);
  }

  function markAttempted() {
    setHasAttemptedCheck(true);
  }

  function setFeedback(next: ExerciseFeedback) {
    setFeedbackState(next);
  }

  function clearTransientFeedback() {
    setFeedbackState((current) =>
      current === "error" || current === "warning" ? "idle" : current,
    );
  }

  function check(): CheckResult {
    return evaluateFillGapsCheck(content, assignments);
  }

  function applySolution() {
    setAssignments(applyFillGapsSolution(content, assignments));
    setActiveGapId(null);
  }

  function reset() {
    setAssignments(initialAssignments);
    setActiveGapId(gapIds[0] ?? null);
    setHasAttemptedCheck(false);
    setFeedbackState("idle");
    setShuffleToken((token) => token + 1);
  }

  function getHints() {
    return hints;
  }

  return {
    kind: "fillGaps",
    assignments,
    activeGapId,
    availableOptions,
    selectOption,
    clearGap,
    setActiveGapId,
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
