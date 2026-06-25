"use client";

import { useEffect, useState, type ReactNode } from "react";

import { ExerciseHintDialog } from "@/components/course/exercises/ExerciseHintDialog";
import { ExerciseSolutionDialog } from "@/components/course/exercises/ExerciseSolutionDialog";
import { SuccessCelebration } from "@/components/course/exercises/SuccessCelebration";
import { toast } from "@/hooks/use-toast";

import type { getFillGapsExerciseConfig } from "../shared/create-exercise-controller";
import { EXERCISE_ERROR_FEEDBACK } from "../shared/exercise-feedback-messages";
import {
  ExerciseSessionContext,
  type ExerciseSessionContextValue,
} from "../shared/exercise-session-context-shared";
import { useFillGapsExerciseController } from "./fill-gaps-controller";
import type { CheckResult } from "../shared/types";
import { useCelebrationAutoDismiss } from "../shared/use-celebration-auto-dismiss";

const TRANSIENT_FEEDBACK_MS = 3000;

type FillGapsSessionBridgeProps = {
  config: NonNullable<ReturnType<typeof getFillGapsExerciseConfig>>;
  children: ReactNode;
  hints: string[];
};

export function FillGapsSessionBridge({
  config,
  children,
  hints,
}: FillGapsSessionBridgeProps) {
  const controller = useFillGapsExerciseController(config.content, hints);
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const { feedback, clearTransientFeedback } = controller;

  useEffect(() => {
    if (feedback !== "error" && feedback !== "warning") {
      return;
    }

    const timeout = window.setTimeout(() => {
      clearTransientFeedback();
    }, TRANSIENT_FEEDBACK_MS);

    return () => window.clearTimeout(timeout);
  }, [feedback, clearTransientFeedback]);

  function dismissCelebration() {
    setShowCelebration(false);
  }

  useCelebrationAutoDismiss(showCelebration, dismissCelebration);

  function handleCheck(): CheckResult | null {
    controller.markAttempted();
    const result = controller.check();

    if (result === "success") {
      controller.setFeedback("success");
      setShowCelebration(true);
      return result;
    }

    setShowCelebration(false);

    if (result === "error") {
      controller.setFeedback("error");
      toast.error(EXERCISE_ERROR_FEEDBACK.label, {
        description: EXERCISE_ERROR_FEEDBACK.text,
      });
      return result;
    }

    controller.setFeedback("warning");
    toast.warning("Dokończ zadanie przed sprawdzeniem.");
    return result;
  }

  function handleProceedAttempt() {
    handleCheck();
  }

  function resetExercise() {
    controller.reset();
    setShowCelebration(false);
    toast.info("Zadanie zostało przywrócone do stanu początkowego.");
  }

  function tryShowSolution() {
    if (!controller.hasAttemptedCheck) {
      toast.warning("Spróbuj najpierw wykonać zadanie samodzielnie.");
      return;
    }
    setSolutionOpen(true);
  }

  function confirmSolution() {
    controller.applySolution();
    controller.setFeedback("solution");
    setSolutionOpen(false);
    toast.success("Poprawna odpowiedź została wstawiona.");
  }

  const isLocked = feedback === "success" || feedback === "solution";
  const canProceed = isLocked;

  const value: ExerciseSessionContextValue = {
    controller,
    feedback,
    showCelebration,
    isLocked,
    canProceed,
    actionBarMode: "check-first",
    hints,
    stageProgress: null,
    canGoBack: false,
    goToPreviousStage: () => {},
    reset: resetExercise,
    handleCheck,
    handleProceedAttempt,
    tryShowSolution,
    showHintDialog: () => setHintOpen(true),
    currentStageActionBarVariant: null,
    advanceCurrentStage: () => {},
    canProceedStage: false,
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
        open={solutionOpen}
        onOpenChange={setSolutionOpen}
        onConfirm={confirmSolution}
      />
      <SuccessCelebration visible={showCelebration} />
    </ExerciseSessionContext.Provider>
  );
}
