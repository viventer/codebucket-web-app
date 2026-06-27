"use client";

import { useState } from "react";

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
  const gapIds = getGapIds(content);
  const initialAssignments = createInitialAssignments(gapIds);

  const [assignments, setAssignments] =
    useState<Record<string, string | null>>(initialAssignments);
  const [activeGapId, setActiveGapId] = useState<string | null>(
    gapIds[0] ?? null,
  );
  const [hasAttemptedCheck, setHasAttemptedCheck] = useState(false);
  const [feedback, setFeedbackState] = useState<ExerciseFeedback>("idle");

  function updateGap(gapId: string, value: string) {
    setAssignments((prev) => ({
      ...prev,
      [gapId]: value === "" ? null : value,
    }));
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
    return evaluateFillGapsCheck(content, assignments, {
      caseInsensitive: true,
    });
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
  }

  function getHints() {
    return hints;
  }

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
