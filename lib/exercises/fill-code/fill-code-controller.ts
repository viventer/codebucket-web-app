"use client";

import { useCallback, useMemo, useState } from "react";

import type { FillCodeContent } from "@/schemas/courseSchema";

import {
  applyFillGapsSolution,
  createInitialAssignments,
  evaluateFillGapsCheck,
  getGapIds,
} from "../fill-gaps/fill-gaps-utils";
import type {
  CheckResult,
  ExerciseFeedback,
  FillCodeExerciseController,
} from "../shared/types";

export function useFillCodeExerciseController(
  content: FillCodeContent,
  hints: string[],
): FillCodeExerciseController {
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

  const updateGap = useCallback((gapId: string, value: string) => {
    setAssignments((prev) => ({
      ...prev,
      [gapId]: value === "" ? null : value,
    }));
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
  }, [gapIds, initialAssignments]);

  const getHints = useCallback(() => hints, [hints]);

  return {
    kind: "fillCode",
    assignments,
    activeGapId,
    updateGap,
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
