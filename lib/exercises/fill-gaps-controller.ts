"use client";

import { useCallback, useMemo, useState } from "react";

import type { FillGapsContent } from "@/schemas/courseSchema";

import type {
  CheckResult,
  ExerciseFeedback,
  FillGapsExerciseController,
} from "./types";

function getGapAnswers(
  content: FillGapsContent,
): { id: string; answer: string }[] {
  const gaps: { id: string; answer: string }[] = [];

  for (const line of content.lines) {
    if (line.kind === "gap") {
      gaps.push({ id: line.id, answer: line.answer });
      continue;
    }

    if (line.kind === "group") {
      for (const segment of line.segments) {
        if (segment.kind === "gap") {
          gaps.push({ id: segment.id, answer: segment.answer });
        }
      }
    }
  }

  return gaps;
}

function getGapIds(content: FillGapsContent): string[] {
  return getGapAnswers(content).map((gap) => gap.id);
}

function getFirstEmptyGapId(
  gapIds: string[],
  assignments: Record<string, string | null>,
): string | null {
  return gapIds.find((id) => assignments[id] === null) ?? null;
}

function createInitialAssignments(
  gapIds: string[],
): Record<string, string | null> {
  const assignments: Record<string, string | null> = {};
  for (const id of gapIds) {
    assignments[id] = null;
  }
  return assignments;
}

function evaluateCheck(
  content: FillGapsContent,
  assignments: Record<string, string | null>,
): CheckResult {
  const gaps = getGapAnswers(content);

  if (gaps.some((gap) => assignments[gap.id] === null)) {
    return "warning";
  }

  const allCorrect = gaps.every(
    (gap) => assignments[gap.id] === gap.answer,
  );

  return allCorrect ? "success" : "error";
}

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

  const availableOptions = useMemo(() => {
    const assignedValues = Object.values(assignments).filter(
      (value): value is string => value !== null,
    );
    const remaining = [...content.options];
    for (const value of assignedValues) {
      const idx = remaining.indexOf(value);
      if (idx !== -1) remaining.splice(idx, 1);
    }
    return remaining;
  }, [assignments, content.options]);

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
    return evaluateCheck(content, assignments);
  }, [assignments, content]);

  const applySolution = useCallback(() => {
    const solution: Record<string, string | null> = { ...assignments };
    for (const gap of getGapAnswers(content)) {
      solution[gap.id] = gap.answer;
    }
    setAssignments(solution);
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
