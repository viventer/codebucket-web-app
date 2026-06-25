"use client";

import { useEffect, useRef, useState } from "react";

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

  function selectAnswer(answerId: number) {
    setState((current) =>
      applySelectCorrectAnswer(current, answerId, content.correctAnswerId),
    );
  }

  function getAnswerVisualState(answerId: number) {
    return getSelectCorrectAnswerVisualState(
      state,
      answerId,
      content.correctAnswerId,
    );
  }

  function getWrongExplanation() {
    return getSelectCorrectWrongExplanation(
      state,
      content.answers,
      content.correctAnswerId,
    );
  }

  function reset() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setState(createInitialSelectCorrectState());
    setShuffleToken((token) => token + 1);
  }

  const isLocked = isSelectCorrectLocked(state);
  const isComplete = isSelectCorrectComplete(state);
  const phase = state.phase;

  let feedback: ExerciseFeedback = "idle";
  if (phase === "correct") {
    feedback = "success";
  } else if (phase === "wrongPending" || phase === "wrongResolved") {
    feedback = "error";
  }

  function check(): CheckResult {
    return isComplete ? "success" : "warning";
  }

  function applySolution() {}

  function getHints() {
    return [];
  }

  function markAttempted() {}

  function setFeedback() {}

  function clearTransientFeedback() {}

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
