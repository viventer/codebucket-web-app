"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ExerciseHintDialog } from "@/components/course/exercises/ExerciseHintDialog";
import { ExerciseSolutionDialog } from "@/components/course/exercises/ExerciseSolutionDialog";
import { SuccessCelebration } from "@/components/course/exercises/SuccessCelebration";
import { toast } from "@/hooks/use-toast";

import type { getMultiStageFillGapsExerciseConfig } from "./create-exercise-controller";
import { EXERCISE_ERROR_FEEDBACK } from "./exercise-feedback-messages";
import {
  ExerciseSessionContext,
  type ExerciseSessionContextValue,
} from "./exercise-session-context-shared";
import { useMultiStageFillGapsExerciseController } from "./multi-stage-fill-gaps-controller";
import type { CheckResult } from "./types";
import { useCelebrationAutoDismiss } from "./use-celebration-auto-dismiss";

const TRANSIENT_FEEDBACK_MS = 3000;
const STAGE_ADVANCE_MS = 2000;

type MultiStageFillGapsSessionBridgeProps = {
  config: NonNullable<ReturnType<typeof getMultiStageFillGapsExerciseConfig>>;
  children: ReactNode;
  hints: string[];
};

export function MultiStageFillGapsSessionBridge({
  config,
  children,
  hints,
}: MultiStageFillGapsSessionBridgeProps) {
  const controller = useMultiStageFillGapsExerciseController(
    config.content,
    hints,
  );
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const advanceTimeoutRef = useRef<number | null>(null);

  const { feedback, clearTransientFeedback, isLastStage, advanceStage } =
    controller;

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current !== null) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (feedback !== "error" && feedback !== "warning") {
      return;
    }

    const timeout = window.setTimeout(() => {
      clearTransientFeedback();
    }, TRANSIENT_FEEDBACK_MS);

    return () => window.clearTimeout(timeout);
  }, [feedback, clearTransientFeedback]);

  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  useCelebrationAutoDismiss(showCelebration, dismissCelebration);

  const handleCheck = useCallback((): CheckResult | null => {
    controller.markAttempted();
    const result = controller.check();

    if (result === "success") {
      if (isLastStage) {
        controller.setFeedback("success");
        setShowCelebration(true);
      } else {
        controller.setFeedback("stageSuccess");
        setShowCelebration(false);
        if (advanceTimeoutRef.current !== null) {
          window.clearTimeout(advanceTimeoutRef.current);
        }
        advanceTimeoutRef.current = window.setTimeout(() => {
          advanceStage();
          controller.setFeedback("idle");
          advanceTimeoutRef.current = null;
        }, STAGE_ADVANCE_MS);
      }
      return result;
    }

    setShowCelebration(false);
    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }

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
  }, [controller, isLastStage, advanceStage]);

  const handleProceedAttempt = useCallback(() => {
    handleCheck();
  }, [handleCheck]);

  const resetExercise = useCallback(() => {
    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    controller.reset();
    setShowCelebration(false);
    toast.info("Zadanie zostało przywrócone do stanu początkowego.");
  }, [controller]);

  const tryShowSolution = useCallback(() => {
    if (!controller.hasAttemptedCheck) {
      toast.warning("Spróbuj najpierw wykonać zadanie samodzielnie.");
      return;
    }
    setSolutionOpen(true);
  }, [controller.hasAttemptedCheck]);

  const confirmSolution = useCallback(() => {
    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    controller.applySolution();
    controller.setFeedback("solution");
    setSolutionOpen(false);
    setShowCelebration(false);
    toast.success("Poprawna odpowiedź została wstawiona.");
  }, [controller]);

  const goToPreviousStage = useCallback(() => {
    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    controller.goToPreviousStage();
    setShowCelebration(false);
  }, [controller]);

  const isLocked =
    feedback === "stageSuccess" ||
    (isLastStage && (feedback === "success" || feedback === "solution"));
  const canProceed =
    isLastStage && (feedback === "success" || feedback === "solution");
  const canGoBack = controller.currentStageIndex > 0 && !isLocked;

  const value = useMemo<ExerciseSessionContextValue>(
    () => ({
      controller,
      feedback,
      showCelebration,
      isLocked,
      canProceed,
      actionBarMode: "multi-stage",
      hints,
      stageProgress: controller.stageProgress,
      canGoBack,
      goToPreviousStage,
      reset: resetExercise,
      handleCheck,
      handleProceedAttempt,
      tryShowSolution,
      showHintDialog: () => setHintOpen(true),
    }),
    [
      controller,
      feedback,
      handleCheck,
      handleProceedAttempt,
      hints,
      isLocked,
      canProceed,
      canGoBack,
      goToPreviousStage,
      showCelebration,
      tryShowSolution,
      resetExercise,
    ],
  );

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
