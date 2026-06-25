"use client";

import { useCallback, useMemo, useState } from "react";

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
  const gapIds = useMemo(() => getGapIds(content), [content]);

  const initialAssignments = useMemo(
    () => createInitialAssignments(gapIds),
    [gapIds],
  );

  const [assignments, setAssignments] =
    useState<Record<string, string | null>>(initialAssignments);
  const [activeGapId, setActiveGapId] = useState<string | null>(
    gapIds[0] ?? null,
  );
  const [hasAttemptedCheck, setHasAttemptedCheck] = useState(false);
  const [feedback, setFeedbackState] = useState<ExerciseFeedback>("idle");
  const [shuffleToken, setShuffleToken] = useState(0);

  const optionOrder = useShuffledItems(content.options, shuffleToken);

  const availableOptions = useMemo(
    () => getAvailableOptions({ ...content, options: optionOrder }, assignments),
    [assignments, content, optionOrder],
  );

  const selectOption = useCallback(
    (option: string) => {
      if (!activeGapId) return;

      setAssignments((prev) => {
        const next = {
          ...prev,
          [activeGapId]: option,
        };
        setActiveGapId(getFirstEmptyGapId(gapIds, next));
        return next;
      });
    },
    [activeGapId, gapIds],
  );

  const clearGap = useCallback((gapId: string) => {
    setAssignments((prev) => ({
      ...prev,
      [gapId]: null,
    }));
    setActiveGapId(gapId);
  }, []);

  const markAttempted = useCallback(() => {
    setHasAttemptedCheck(true);
  }, []);

  const setFeedback = useCallback((next: ExerciseFeedback) => {
    setFeedbackState(next);
  }, []);

  const clearTransientFeedback = useCallback(() => {
    setFeedbackState((current) =>
      current === "error" || current === "warning" ? "idle" : current,
    );
  }, []);

  const check = useCallback((): CheckResult => {
    return evaluateFillGapsCheck(content, assignments);
  }, [assignments, content]);

  const applySolution = useCallback(() => {
    setAssignments(applyFillGapsSolution(content, assignments));
    setActiveGapId(null);
  }, [assignments, content]);

  const reset = useCallback(() => {
    setAssignments(initialAssignments);
    setActiveGapId(gapIds[0] ?? null);
    setHasAttemptedCheck(false);
    setFeedbackState("idle");
    setShuffleToken((token) => token + 1);
  }, [gapIds, initialAssignments]);

  const getHints = useCallback(() => hints, [hints]);

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
