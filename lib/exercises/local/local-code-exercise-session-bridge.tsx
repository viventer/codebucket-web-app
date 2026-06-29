"use client";

import { useState, type ReactNode } from "react";

import { ExerciseCodeSolutionDialog } from "@/components/course/exercises/ExerciseCodeSolutionDialog";
import { ExerciseHintDialog } from "@/components/course/exercises/ExerciseHintDialog";
import { ExerciseSolutionDialog } from "@/components/course/exercises/ExerciseSolutionDialog";
import type { LocalCodeExerciseConfig } from "@/lib/exercises/shared/create-exercise-controller";
import {
  ExerciseSessionContext,
  type ExerciseSessionContextValue,
} from "@/lib/exercises/shared/exercise-session-context-shared";

type LocalCodeExerciseSessionBridgeProps = {
  config: LocalCodeExerciseConfig;
  hints: string[];
  children: ReactNode;
};

export function LocalCodeExerciseSessionBridge({
  config,
  hints,
  children,
}: LocalCodeExerciseSessionBridgeProps) {
  const [localPhase, setLocalPhase] = useState<"working" | "completed">(
    "working",
  );
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionConfirmOpen, setSolutionConfirmOpen] = useState(false);
  const [solutionCodeOpen, setSolutionCodeOpen] = useState(false);

  function markLocalExerciseCompleted() {
    setLocalPhase("completed");
  }

  function tryShowSolution() {
    setSolutionConfirmOpen(true);
  }

  function confirmSolution() {
    setSolutionConfirmOpen(false);
    setSolutionCodeOpen(true);
  }

  const value: ExerciseSessionContextValue = {
    controller: null,
    feedback: "idle",
    showCelebration: false,
    isLocked: false,
    canProceed: false,
    actionBarMode: "interactive",
    hints,
    stageProgress: null,
    canGoBack: false,
    goToPreviousStage: () => {},
    reset: () => {},
    handleCheck: () => null,
    handleProceedAttempt: () => {},
    tryShowSolution,
    showHintDialog: () => setHintOpen(true),
    currentStageActionBarVariant: null,
    advanceCurrentStage: () => {},
    canProceedStage: false,
    localPhase,
    markLocalExerciseCompleted,
  };

  return (
    <ExerciseSessionContext.Provider value={value}>
      {children}
      <ExerciseHintDialog
        open={hintOpen}
        onOpenChange={setHintOpen}
        hints={hints}
      />
      <ExerciseSolutionDialog
        open={solutionConfirmOpen}
        onOpenChange={setSolutionConfirmOpen}
        onConfirm={confirmSolution}
      />
      <ExerciseCodeSolutionDialog
        open={solutionCodeOpen}
        onOpenChange={setSolutionCodeOpen}
        solutionCode={config.content.solutionCode}
      />
    </ExerciseSessionContext.Provider>
  );
}
