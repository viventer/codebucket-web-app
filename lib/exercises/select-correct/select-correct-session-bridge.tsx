"use client";

import { useEffect, useState, type ReactNode } from "react";

import { SuccessCelebration } from "@/components/course/exercises/SuccessCelebration";
import { toast } from "@/hooks/use-toast";

import type { getSelectCorrectExerciseConfig } from "../shared/create-exercise-controller";
import {
  ExerciseSessionContext,
  type ExerciseSessionContextValue,
} from "../shared/exercise-session-context-shared";
import { useSelectCorrectExerciseController } from "./select-correct-controller";
import { useCelebrationAutoDismiss } from "../shared/use-celebration-auto-dismiss";

type SelectCorrectSessionBridgeProps = {
  config: NonNullable<ReturnType<typeof getSelectCorrectExerciseConfig>>;
  children: ReactNode;
};

export function SelectCorrectSessionBridge({
  config,
  children,
}: SelectCorrectSessionBridgeProps) {
  const controller = useSelectCorrectExerciseController(config.content);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (controller.phase !== "correct") {
      return;
    }

    setShowCelebration(true);
  }, [controller.phase]);

  function dismissCelebration() {
    setShowCelebration(false);
  }

  useCelebrationAutoDismiss(showCelebration, dismissCelebration);

  function handleProceedAttempt() {
    toast.warning("Wykonaj ćwiczenie, zanim przejdziesz dalej.");
  }

  const isLocked = controller.isComplete;
  const canProceed = controller.isComplete;

  const value: ExerciseSessionContextValue = {
    controller,
    feedback: controller.feedback,
    showCelebration,
    isLocked,
    canProceed,
    actionBarMode: "back-next-gated",
    hints: [],
    stageProgress: null,
    canGoBack: false,
    goToPreviousStage: () => {},
    reset: () => controller.reset(),
    handleCheck: () => null,
    handleProceedAttempt,
    tryShowSolution: () => {},
    showHintDialog: () => {},
    currentStageActionBarVariant: "gated",
    advanceCurrentStage: () => {},
    canProceedStage: false,
  };

  return (
    <ExerciseSessionContext.Provider value={value}>
      {children}
      <SuccessCelebration visible={showCelebration} />
    </ExerciseSessionContext.Provider>
  );
}
