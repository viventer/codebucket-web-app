"use client";

import { useCallback, useState, type Dispatch, type SetStateAction } from "react";

import type { MultiStageContent } from "@/schemas/courseSchema";

import type { MultiStageFlowPhase, StageProgress } from "../../shared/types";
import {
  prepareChooseMatchingRetryStageState,
  prepareSelectCorrectRetryStageState,
} from "../retry/prepare-retry-stage-state";
import type { StageState } from "../stage-state";

type UseMultiStageFlowParams = {
  content: MultiStageContent;
  stageStates: StageState[];
  setStageStates: Dispatch<SetStateAction<StageState[]>>;
  bumpShuffleToken: (stageIndex: number) => void;
};

export function useMultiStageFlow({
  content,
  stageStates,
  setStageStates,
  bumpShuffleToken,
}: UseMultiStageFlowParams) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [flowPhase, setFlowPhase] = useState<MultiStageFlowPhase>("main");
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

  const enterRetryStage = useCallback(
    (stageIndex: number, queueIndex: number) => {
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
    },
    [bumpShuffleToken, setStageStates],
  );

  const startRetryPhase = useCallback(() => {
    const firstRetryStage = retryQueue[0];
    if (firstRetryStage === undefined) {
      return;
    }

    enterRetryStage(firstRetryStage, 0);
  }, [enterRetryStage, retryQueue]);

  const advanceStage = useCallback(() => {
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
  }, [
    currentStageIndex,
    enterRetryStage,
    flowPhase,
    retryQueue,
    retryQueueIndex,
    startRetryPhase,
    totalStages,
  ]);

  const goToPreviousStage = useCallback(() => {
    if (flowPhase === "retry" || currentStageIndex === 0) {
      return;
    }
    setCurrentStageIndex((index) => index - 1);
  }, [currentStageIndex, flowPhase]);

  const resetFlow = useCallback(() => {
    setCurrentStageIndex(0);
    setFlowPhase("main");
    setRetryQueue([]);
    setRetryQueueIndex(0);
  }, []);

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
