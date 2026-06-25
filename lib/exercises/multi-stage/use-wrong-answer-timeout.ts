"use client";

import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";

import { resolveSelectCorrectWrongAnswer } from "../select-correct/select-correct-state";

import type { StageState } from "./stage-state";

const WRONG_ANSWER_RESOLVE_MS = 500;

export function useMultiStageWrongAnswerTimeout(
  currentStageIndex: number,
  currentState: StageState,
  setStageStates: Dispatch<SetStateAction<StageState[]>>,
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

    wrongAnswerTimeoutRef.current = window.setTimeout(() => {
      setStageStates((prev) => {
        const next = [...prev];
        const stageState = next[currentStageIndex];
        if (stageState?.kind !== "selectCorrect") {
          return prev;
        }

        next[currentStageIndex] = {
          ...stageState,
          selectCorrect: resolveSelectCorrectWrongAnswer(stageState.selectCorrect),
        };
        return next;
      });
      wrongAnswerTimeoutRef.current = null;
    }, WRONG_ANSWER_RESOLVE_MS);

    return () => {
      if (wrongAnswerTimeoutRef.current !== null) {
        window.clearTimeout(wrongAnswerTimeoutRef.current);
        wrongAnswerTimeoutRef.current = null;
      }
    };
  }, [currentStageIndex, currentState, setStageStates]);

  const clearWrongAnswerTimeout = () => {
    if (wrongAnswerTimeoutRef.current !== null) {
      window.clearTimeout(wrongAnswerTimeoutRef.current);
      wrongAnswerTimeoutRef.current = null;
    }
  };

  return { clearWrongAnswerTimeout };
}
