"use client";

import { useCallback } from "react";

import { useShuffledItems } from "@/lib/shuffle";

import {
  applySelectCorrectAnswer,
  getSelectCorrectAnswerVisualState,
  getSelectCorrectWrongExplanation,
} from "../../select-correct/select-correct-state";
import { EMPTY_SELECT_CORRECT_ANSWERS } from "../stage-state";
import { isSelectCorrectStage } from "../stage-utils";
import type { MultiStageCoreContext, MultiStageSelectCorrectStage } from "../types";

export function useSelectCorrectStage(
  ctx: MultiStageCoreContext,
): MultiStageSelectCorrectStage | null {
  const { currentStage, currentState, shuffleToken, updateCurrentStageState } =
    ctx;

  const selectCorrectStage =
    currentState.kind === "selectCorrect" && isSelectCorrectStage(currentStage)
      ? currentStage
      : null;

  const shuffledAnswers = useShuffledItems(
    selectCorrectStage?.answers ?? EMPTY_SELECT_CORRECT_ANSWERS,
    currentState.kind === "selectCorrect" ? shuffleToken : 0,
  );

  const selectAnswer = useCallback(
    (answerId: number) => {
      if (!selectCorrectStage || currentState.kind !== "selectCorrect") {
        return;
      }

      updateCurrentStageState((state) => {
        if (state.kind !== "selectCorrect") {
          return state;
        }

        const selectCorrect = applySelectCorrectAnswer(
          state.selectCorrect,
          answerId,
          selectCorrectStage.correctAnswerId,
        );

        const retryCompleted =
          selectCorrect.attempt === "retry" && selectCorrect.phase === "correct"
            ? true
            : state.retryCompleted;

        return {
          ...state,
          selectCorrect,
          retryCompleted,
        };
      });
    },
    [currentState.kind, selectCorrectStage, updateCurrentStageState],
  );

  const getAnswerVisualState = useCallback(
    (answerId: number) => {
      if (!selectCorrectStage || currentState.kind !== "selectCorrect") {
        return "idle" as const;
      }

      return getSelectCorrectAnswerVisualState(
        currentState.selectCorrect,
        answerId,
        selectCorrectStage.correctAnswerId,
      );
    },
    [currentState, selectCorrectStage],
  );

  const getWrongExplanation = useCallback(() => {
    if (!selectCorrectStage || currentState.kind !== "selectCorrect") {
      return null;
    }

    return getSelectCorrectWrongExplanation(
      currentState.selectCorrect,
      selectCorrectStage.answers,
      selectCorrectStage.correctAnswerId,
    );
  }, [currentState, selectCorrectStage]);

  if (!selectCorrectStage || currentState.kind !== "selectCorrect") {
    return null;
  }

  return {
    type: "selectCorrect",
    question: selectCorrectStage.question,
    prompt: selectCorrectStage.prompt,
    persisted: currentState.selectCorrect,
    shuffledAnswers,
    selectAnswer,
    getAnswerVisualState,
    getWrongExplanation,
  };
}
