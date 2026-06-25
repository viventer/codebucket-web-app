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

import type { getMultiStageExerciseConfig } from "../shared/create-exercise-controller";
import { EXERCISE_ERROR_FEEDBACK } from "../shared/exercise-feedback-messages";
import {
  ExerciseSessionContext,
  type ExerciseSessionContextValue,
} from "../shared/exercise-session-context-shared";
import type { CheckResult, ExerciseFeedback } from "../shared/types";
import { useCelebrationAutoDismiss } from "../shared/use-celebration-auto-dismiss";
import { useMultiStageExerciseController } from "./multi-stage-controller";

const TRANSIENT_FEEDBACK_MS = 3000;
const STAGE_ADVANCE_AFTER_CORRECT_MS = 1500;
const STAGE_ADVANCE_AFTER_WRONG_MS = 4000;

function persistStageCompletionFeedback(
  setFeedback: (feedback: ExerciseFeedback) => void,
  feedback: ExerciseFeedback | null,
) {
  if (feedback === "stageSuccess") {
    setFeedback("success");
  } else if (feedback === "stageSolution") {
    setFeedback("solution");
  }
}

type MultiStageSessionBridgeProps = {
  config: NonNullable<ReturnType<typeof getMultiStageExerciseConfig>>;
  children: ReactNode;
  hints: string[];
};

export function MultiStageSessionBridge({
  config,
  children,
  hints,
}: MultiStageSessionBridgeProps) {
  const controller = useMultiStageExerciseController(config.content, hints);
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const advanceTimeoutRef = useRef<number | null>(null);
  const autoAdvancedStagesRef = useRef<Set<number>>(new Set());

  const { feedback, clearTransientFeedback, isLastStage, advanceStage } =
    controller;

  const clearAdvanceTimeout = useCallback(() => {
    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearAdvanceTimeout;
  }, [clearAdvanceTimeout]);

  useEffect(() => {
    if (feedback !== "error" && feedback !== "warning") {
      return;
    }

    const timeout = window.setTimeout(() => {
      clearTransientFeedback();
    }, TRANSIENT_FEEDBACK_MS);

    return () => window.clearTimeout(timeout);
  }, [feedback, clearTransientFeedback]);

  useEffect(() => {
    if (controller.flowPhase === "retry") {
      autoAdvancedStagesRef.current.clear();
    }
  }, [controller.flowPhase]);

  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  useCelebrationAutoDismiss(showCelebration, dismissCelebration);

  const scheduleMiddleStageAdvance = useCallback(
    (
      advanceFeedback: ExerciseFeedback | null = "stageSuccess",
      delayMs: number = STAGE_ADVANCE_AFTER_CORRECT_MS,
    ) => {
      if (isLastStage || advanceTimeoutRef.current !== null) {
        return;
      }

      autoAdvancedStagesRef.current.add(controller.currentStageIndex);
      if (advanceFeedback !== null) {
        controller.setFeedback(advanceFeedback);
      }
      setShowCelebration(false);
      advanceTimeoutRef.current = window.setTimeout(() => {
        persistStageCompletionFeedback(controller.setFeedback, advanceFeedback);
        advanceStage();
        advanceTimeoutRef.current = null;
      }, delayMs);
    },
    [advanceStage, controller, isLastStage],
  );

  useEffect(() => {
    if (
      controller.currentStageActionBarVariant !== "gated" ||
      isLastStage ||
      !controller.isCurrentStageComplete ||
      autoAdvancedStagesRef.current.has(controller.currentStageIndex)
    ) {
      return;
    }

    const phase = controller.selectCorrectPersisted?.phase;
    const isWrongAdvance =
      phase === "wrongDeferred" || phase === "wrongResolved";
    const delayMs = isWrongAdvance
      ? STAGE_ADVANCE_AFTER_WRONG_MS
      : STAGE_ADVANCE_AFTER_CORRECT_MS;
    const advanceFeedback = isWrongAdvance ? null : "stageSuccess";

    scheduleMiddleStageAdvance(advanceFeedback, delayMs);
  }, [
    controller.currentStageActionBarVariant,
    controller.currentStageIndex,
    controller.isCurrentStageComplete,
    controller.selectCorrectPersisted?.phase,
    isLastStage,
    scheduleMiddleStageAdvance,
  ]);

  useEffect(() => {
    if (
      controller.currentStageActionBarVariant !== "gated" ||
      !controller.isLastStage ||
      !controller.isCurrentStageComplete ||
      !controller.isExerciseComplete ||
      controller.feedback !== "success"
    ) {
      return;
    }

    setShowCelebration(true);
  }, [
    controller.currentStageActionBarVariant,
    controller.feedback,
    controller.isCurrentStageComplete,
    controller.isExerciseComplete,
    controller.isLastStage,
  ]);

  const handleCheck = useCallback((): CheckResult | null => {
    controller.markAttempted();
    const result = controller.check();

    if (result === "success") {
      if (isLastStage) {
        controller.setFeedback("success");
        setShowCelebration(true);
      } else {
        scheduleMiddleStageAdvance();
      }
      return result;
    }

    setShowCelebration(false);
    clearAdvanceTimeout();

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
  }, [
    clearAdvanceTimeout,
    controller,
    isLastStage,
    scheduleMiddleStageAdvance,
  ]);

  const handleProceedAttempt = useCallback(() => {
    if (controller.currentStageActionBarVariant === "gated") {
      toast.warning("Wykonaj ćwiczenie, zanim przejdziesz dalej.");
      return;
    }
    handleCheck();
  }, [controller.currentStageActionBarVariant, handleCheck]);

  const resetExercise = useCallback(() => {
    clearAdvanceTimeout();
    autoAdvancedStagesRef.current.clear();
    controller.reset();
    setShowCelebration(false);
    toast.info("Zadanie zostało przywrócone do stanu początkowego.");
  }, [clearAdvanceTimeout, controller]);

  const tryShowSolution = useCallback(() => {
    if (!controller.hasAttemptedCheck) {
      toast.warning("Spróbuj najpierw wykonać zadanie samodzielnie.");
      return;
    }
    setSolutionOpen(true);
  }, [controller.hasAttemptedCheck]);

  const confirmSolution = useCallback(() => {
    clearAdvanceTimeout();
    controller.applySolution();
    setSolutionOpen(false);
    setShowCelebration(false);
    toast.success("Poprawna odpowiedź została wstawiona.");

    if (isLastStage) {
      controller.setFeedback("solution");
      return;
    }

    scheduleMiddleStageAdvance("stageSolution");
  }, [
    clearAdvanceTimeout,
    controller,
    isLastStage,
    scheduleMiddleStageAdvance,
  ]);

  const advanceCurrentStage = useCallback(() => {
    clearAdvanceTimeout();
    if (isLastStage) {
      return;
    }

    persistStageCompletionFeedback(controller.setFeedback, feedback);
    autoAdvancedStagesRef.current.add(controller.currentStageIndex);
    advanceStage();
    setShowCelebration(false);
  }, [advanceStage, clearAdvanceTimeout, controller, feedback, isLastStage]);

  const goToPreviousStage = useCallback(() => {
    clearAdvanceTimeout();
    controller.goToPreviousStage();
    setShowCelebration(false);
  }, [clearAdvanceTimeout, controller]);

  const isGatedStage = controller.currentStageActionBarVariant === "gated";
  const isLocked =
    feedback === "stageSuccess" ||
    feedback === "stageSolution" ||
    (isLastStage && (feedback === "success" || feedback === "solution"));

  const canProceed =
    isLastStage &&
    controller.isExerciseComplete &&
    controller.isCurrentStageComplete &&
    (isGatedStage ? true : feedback === "success" || feedback === "solution");

  const canProceedStage =
    !isLastStage &&
    (feedback === "stageSuccess" ||
      feedback === "stageSolution" ||
      controller.isCurrentStageComplete);

  const canGoBack =
    controller.flowPhase === "main" &&
    controller.currentStageIndex > 0 &&
    !isLocked;

  const value = useMemo<ExerciseSessionContextValue>(
    () => ({
      controller,
      feedback,
      showCelebration,
      isLocked,
      canProceed,
      actionBarMode: "multi-stage",
      hints: isGatedStage ? [] : hints,
      stageProgress: controller.stageProgress,
      canGoBack,
      goToPreviousStage,
      reset: resetExercise,
      handleCheck,
      handleProceedAttempt,
      tryShowSolution: isGatedStage ? () => {} : tryShowSolution,
      showHintDialog: isGatedStage ? () => {} : () => setHintOpen(true),
      currentStageActionBarVariant: controller.currentStageActionBarVariant,
      advanceCurrentStage,
      canProceedStage,
    }),
    [
      controller,
      feedback,
      handleCheck,
      handleProceedAttempt,
      hints,
      isGatedStage,
      isLocked,
      canProceed,
      canProceedStage,
      canGoBack,
      goToPreviousStage,
      showCelebration,
      tryShowSolution,
      resetExercise,
      advanceCurrentStage,
    ],
  );

  return (
    <ExerciseSessionContext.Provider value={value}>
      {children}
      {!isGatedStage && (
        <>
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
        </>
      )}
      <SuccessCelebration visible={showCelebration} />
    </ExerciseSessionContext.Provider>
  );
}
