"use client";

import { useCallback, useState } from "react";

import type { MultiStageContent } from "@/schemas/courseSchema";

import { createAllStageStates, type StageState } from "../stage-state";

export function useStageStates(content: MultiStageContent) {
  const [stageStates, setStageStates] = useState<StageState[]>(() =>
    createAllStageStates(content),
  );
  const [shuffleTokens, setShuffleTokens] = useState<number[]>(() =>
    content.stages.map(() => 0),
  );

  const updateCurrentStageState = useCallback(
    (currentStageIndex: number, updater: (state: StageState) => StageState) => {
      setStageStates((prev) => {
        const next = [...prev];
        next[currentStageIndex] = updater(prev[currentStageIndex]!);
        return next;
      });
    },
    [],
  );

  const bumpShuffleToken = useCallback((stageIndex: number) => {
    setShuffleTokens((prev) => {
      const next = [...prev];
      next[stageIndex] = (next[stageIndex] ?? 0) + 1;
      return next;
    });
  }, []);

  const resetStageStates = useCallback(() => {
    setStageStates(createAllStageStates(content));
    setShuffleTokens(content.stages.map(() => 0));
  }, [content]);

  return {
    stageStates,
    setStageStates,
    shuffleTokens,
    updateCurrentStageState,
    bumpShuffleToken,
    resetStageStates,
  };
}
