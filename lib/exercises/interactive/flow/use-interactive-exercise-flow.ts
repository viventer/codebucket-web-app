"use client";

import { useState, type Dispatch, type SetStateAction } from "react";

import type { InteractiveExerciseContent } from "@/schemas/exerciseSchema";

import type { InteractiveExerciseFlowPhase, StageProgress } from "../../shared/types";
import {
  prepareChooseMatchingRetryStageState,
  prepareSelectCorrectRetryStageState,
} from "../retry/prepare-retry-stage-state";
import type { StageState } from "../stage-state";

type UseInteractiveExerciseFlowParams = {
  content: InteractiveExerciseContent;
  stageStates: StageState[];
  setStageStates: Dispatch<SetStateAction<StageState[]>>;
  bumpShuffleToken: (stageIndex: number) => void;
};

export function useInteractiveExerciseFlow({
  content,
  stageStates,
  setStageStates,
  bumpShuffleToken,
}: UseInteractiveExerciseFlowParams) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [flowPhase, setFlowPhase] = useState<InteractiveExerciseFlowPhase>("main");
  const [retryQueue, setRetryQueue] = useState<number[]>([]);
  const [retryQueueIndex, setRetryQueueIndex] = useState(0);

  const totalStages = content.stages.length;
  const currentStage = content.stages[currentStageIndex]!;
  const currentState = stageStates[currentStageIndex]!;
  const isLastMainStage = currentStageIndex === totalStages - 1;
  const isLastStage =
    flowPhase === "retry"
      ? retryQueueIndex === retryQueue.length - 1
      : isLastMainStage && retryQueue.length === 0;

  const stageProgress: StageProgress =
    flowPhase === "retry"
      ? {
          current: retryQueueIndex + 1,
          total: retryQueue.length,
        }
      : {
          current: currentStageIndex + 1,
          total: totalStages,
        };

  function enterRetryStage(stageIndex: number, queueIndex: number) {
    setFlowPhase("retry");
    setRetryQueueIndex(queueIndex);
    setCurrentStageIndex(stageIndex);

    setStageStates((prev) => {
      const next = [...prev];
      const stageState = next[stageIndex];

      if (stageState?.kind === "selectCorrect") {
        next[stageIndex] = prepareSelectCorrectRetryStageState(stageState);
        return next;
      }

      if (stageState?.kind === "chooseMatching") {
        next[stageIndex] = prepareChooseMatchingRetryStageState(stageState);
        return next;
      }

      return prev;
    });

    bumpShuffleToken(stageIndex);
  }

  function startRetryPhase() {
    const firstRetryStage = retryQueue[0];
    if (firstRetryStage === undefined) {
      return;
    }

    enterRetryStage(firstRetryStage, 0);
  }

  function advanceStage() {
    if (flowPhase === "retry") {
      if (retryQueueIndex < retryQueue.length - 1) {
        const nextQueueIndex = retryQueueIndex + 1;
        const nextStageIndex = retryQueue[nextQueueIndex]!;
        enterRetryStage(nextStageIndex, nextQueueIndex);
      }
      return;
    }

    if (currentStageIndex < totalStages - 1) {
      setCurrentStageIndex((index) => index + 1);
      return;
    }

    if (retryQueue.length > 0) {
      startRetryPhase();
    }
  }

  function goToPreviousStage() {
    if (flowPhase === "retry" || currentStageIndex === 0) {
      return;
    }
    setCurrentStageIndex((index) => index - 1);
  }

  function resetFlow() {
    setCurrentStageIndex(0);
    setFlowPhase("main");
    setRetryQueue([]);
    setRetryQueueIndex(0);
  }

  return {
    currentStageIndex,
    currentStage,
    currentState,
    flowPhase,
    retryQueue,
    setRetryQueue,
    isLastStage,
    stageProgress,
    advanceStage,
    goToPreviousStage,
    resetFlow,
  };
}
