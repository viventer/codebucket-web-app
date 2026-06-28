"use client";

import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";

import {
  deferSelectCorrectWrongAnswer,
  resolveSelectCorrectWrongAnswer,
} from "../select-correct/select-correct-state";

import type { StageState } from "./stage-state";

const WRONG_ANSWER_RESOLVE_MS = 500;

export function useInteractiveExerciseWrongAnswerTimeout(
  currentStageIndex: number,
  currentState: StageState,
  setStageStates: Dispatch<SetStateAction<StageState[]>>,
  setRetryQueue: Dispatch<SetStateAction<number[]>>,
) {
  const wrongAnswerTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (wrongAnswerTimeoutRef.current !== null) {
        window.clearTimeout(wrongAnswerTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (
      currentState.kind !== "selectCorrect" ||
      currentState.selectCorrect.phase !== "wrongPending"
    ) {
      return;
    }

    const attempt = currentState.selectCorrect.attempt;

    wrongAnswerTimeoutRef.current = window.setTimeout(() => {
      setStageStates((prev) => {
        const next = [...prev];
        const stageState = next[currentStageIndex];
        if (stageState?.kind !== "selectCorrect") {
          return prev;
        }

        if (attempt === "first") {
          next[currentStageIndex] = {
            ...stageState,
            firstAttemptWrong: true,
            selectCorrect: deferSelectCorrectWrongAnswer(stageState.selectCorrect),
          };
        } else {
          next[currentStageIndex] = {
            ...stageState,
            retryCompleted: true,
            selectCorrect: resolveSelectCorrectWrongAnswer(stageState.selectCorrect),
          };
        }

        return next;
      });

      if (attempt === "first") {
        setRetryQueue((prev) =>
          prev.includes(currentStageIndex)
            ? prev
            : [...prev, currentStageIndex].sort((a, b) => a - b),
        );
      }

      wrongAnswerTimeoutRef.current = null;
    }, WRONG_ANSWER_RESOLVE_MS);

    return () => {
      if (wrongAnswerTimeoutRef.current !== null) {
        window.clearTimeout(wrongAnswerTimeoutRef.current);
        wrongAnswerTimeoutRef.current = null;
      }
    };
  }, [currentStageIndex, currentState, setRetryQueue, setStageStates]);

  const clearWrongAnswerTimeout = () => {
    if (wrongAnswerTimeoutRef.current !== null) {
      window.clearTimeout(wrongAnswerTimeoutRef.current);
      wrongAnswerTimeoutRef.current = null;
    }
  };

  return { clearWrongAnswerTimeout };
}
