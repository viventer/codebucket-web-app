"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useShuffledItems } from "@/lib/shuffle";
import type { SelectCorrectContent } from "@/schemas/courseSchema";

import {
  applySelectCorrectAnswer,
  createInitialSelectCorrectState,
  getSelectCorrectAnswerVisualState,
  getSelectCorrectWrongExplanation,
  isSelectCorrectComplete,
  isSelectCorrectLocked,
  resolveSelectCorrectWrongAnswer,
} from "./select-correct-state";
import type {
  CheckResult,
  ExerciseFeedback,
  SelectCorrectExerciseController,
} from "../shared/types";

export function useSelectCorrectExerciseController(
  content: SelectCorrectContent,
): SelectCorrectExerciseController {
  const [state, setState] = useState(createInitialSelectCorrectState);
  const [shuffleToken, setShuffleToken] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const shuffledAnswers = useShuffledItems(content.answers, shuffleToken);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (state.phase !== "wrongPending") {
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setState((current) => resolveSelectCorrectWrongAnswer(current));
      timeoutRef.current = null;
    }, 500);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [state.phase]);

  const selectAnswer = useCallback(
    (answerId: number) => {
      setState((current) =>
        applySelectCorrectAnswer(current, answerId, content.correctAnswerId),
      );
    },
    [content.correctAnswerId],
  );

  const getAnswerVisualState = useCallback(
    (answerId: number) =>
      getSelectCorrectAnswerVisualState(
        state,
        answerId,
        content.correctAnswerId,
      ),
    [content.correctAnswerId, state],
  );

  const getWrongExplanation = useCallback(
    () =>
      getSelectCorrectWrongExplanation(
        state,
        content.answers,
        content.correctAnswerId,
      ),
    [content.answers, content.correctAnswerId, state],
  );

  const reset = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setState(createInitialSelectCorrectState());
    setShuffleToken((token) => token + 1);
  }, []);

  const isLocked = isSelectCorrectLocked(state);
  const isComplete = isSelectCorrectComplete(state);
  const phase = state.phase;

  const feedback = useMemo<ExerciseFeedback>(() => {
    if (phase === "correct") {
      return "success";
    }
    if (phase === "wrongPending" || phase === "wrongResolved") {
      return "error";
    }
    return "idle";
  }, [phase]);

  const check = useCallback((): CheckResult => {
    return isComplete ? "success" : "warning";
  }, [isComplete]);

  const applySolution = useCallback(() => {}, []);

  const getHints = useCallback(() => [], []);

  const markAttempted = useCallback(() => {}, []);

  const setFeedback = useCallback(() => {}, []);

  const clearTransientFeedback = useCallback(() => {}, []);

  return {
    kind: "selectCorrect",
    content,
    shuffledAnswers,
    selectedAnswerId: state.selectedAnswerId,
    phase,
    isLocked,
    isComplete,
    selectAnswer,
    getAnswerVisualState,
    getWrongExplanation,
    check,
    applySolution,
    reset,
    getHints,
    hasAttemptedCheck: isLocked,
    feedback,
    markAttempted,
    setFeedback,
    clearTransientFeedback,
  };
}
