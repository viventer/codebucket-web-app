"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { SuccessCelebration } from "@/components/course/exercises/SuccessCelebration";
import { toast } from "@/hooks/use-toast";

import type { getMatchPairsExerciseConfig } from "./create-exercise-controller";
import {
  ExerciseSessionContext,
  type ExerciseSessionContextValue,
} from "./exercise-session-context-shared";
import { useMatchPairsExerciseController } from "./match-pairs-controller";
import { useCelebrationAutoDismiss } from "./use-celebration-auto-dismiss";

type MatchPairsSessionBridgeProps = {
  config: NonNullable<ReturnType<typeof getMatchPairsExerciseConfig>>;
  children: ReactNode;
};

export function MatchPairsSessionBridge({
  config,
  children,
}: MatchPairsSessionBridgeProps) {
  const controller = useMatchPairsExerciseController(config.content);
  const [showCelebration, setShowCelebration] = useState(false);

  const { feedback } = controller;

  useEffect(() => {
    if (feedback !== "success") {
      return;
    }

    setShowCelebration(true);
  }, [feedback]);

  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  useCelebrationAutoDismiss(showCelebration, dismissCelebration);

  const handleProceedAttempt = useCallback(() => {
    toast.warning("Wykonaj ćwiczenie, zanim przejdziesz dalej.");
  }, []);

  const isLocked = feedback === "success";
  const canProceed = isLocked;

  const value = useMemo<ExerciseSessionContextValue>(
    () => ({
      controller,
      feedback,
      showCelebration,
      isLocked,
      canProceed,
      actionBarMode: "back-next-gated",
      hints: [],
      stageProgress: null,
      canGoBack: false,
      goToPreviousStage: () => {},
      reset: () => {},
      handleCheck: () => null,
      handleProceedAttempt,
      tryShowSolution: () => {},
      showHintDialog: () => {},
    }),
    [
      controller,
      feedback,
      handleProceedAttempt,
      isLocked,
      canProceed,
      showCelebration,
    ],
  );

  return (
    <ExerciseSessionContext.Provider value={value}>
      {children}
      <SuccessCelebration visible={showCelebration} />
    </ExerciseSessionContext.Provider>
  );
}
