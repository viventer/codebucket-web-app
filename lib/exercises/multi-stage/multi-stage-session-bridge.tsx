"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

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

  const { navigation, session, feedback, clearTransientFeedback } = controller;
  const { isLastStage, advanceStage, currentStageIndex, flowPhase, stageProgress } =
    navigation;

  function clearAdvanceTimeout() {
    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  }

  useEffect(() => {
    return clearAdvanceTimeout;
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

  useEffect(() => {
    if (flowPhase === "retry") {
      autoAdvancedStagesRef.current.clear();
    }
  }, [flowPhase]);

  function dismissCelebration() {
    setShowCelebration(false);
  }

  useCelebrationAutoDismiss(showCelebration, dismissCelebration);

  function scheduleMiddleStageAdvance(
    advanceFeedback: ExerciseFeedback | null = "stageSuccess",
    delayMs: number = STAGE_ADVANCE_AFTER_CORRECT_MS,
  ) {
    if (isLastStage || advanceTimeoutRef.current !== null) {
      return;
    }

    autoAdvancedStagesRef.current.add(currentStageIndex);
    if (advanceFeedback !== null) {
      controller.setFeedback(advanceFeedback);
    }
    setShowCelebration(false);
    advanceTimeoutRef.current = window.setTimeout(() => {
      persistStageCompletionFeedback(controller.setFeedback, advanceFeedback);
      advanceStage();
      advanceTimeoutRef.current = null;
    }, delayMs);
  }

  useEffect(() => {
    if (
      session.currentStageActionBarVariant !== "gated" ||
      isLastStage ||
      !session.isCurrentStageComplete ||
      autoAdvancedStagesRef.current.has(currentStageIndex)
    ) {
      return;
    }

    const phase =
      controller.stage.type === "selectCorrect"
        ? controller.stage.persisted.phase
        : undefined;
    const isWrongAdvance =
      phase === "wrongDeferred" || phase === "wrongResolved";
    const delayMs = isWrongAdvance
      ? STAGE_ADVANCE_AFTER_WRONG_MS
      : STAGE_ADVANCE_AFTER_CORRECT_MS;
    const advanceFeedback = isWrongAdvance ? null : "stageSuccess";

    scheduleMiddleStageAdvance(advanceFeedback, delayMs);
  }, [
    session.currentStageActionBarVariant,
    currentStageIndex,
    session.isCurrentStageComplete,
    controller.stage,
    isLastStage,
  ]);

  useEffect(() => {
    if (
      session.currentStageActionBarVariant !== "gated" ||
      !isLastStage ||
      !session.isCurrentStageComplete ||
      !session.isExerciseComplete ||
      controller.feedback !== "success"
    ) {
      return;
    }

    setShowCelebration(true);
  }, [
    session.currentStageActionBarVariant,
    controller.feedback,
    session.isCurrentStageComplete,
    session.isExerciseComplete,
    isLastStage,
  ]);

  function handleCheck(): CheckResult | null {
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
      if (controller.stage.type === "chooseMatching") {
        if (!isLastStage) {
          scheduleMiddleStageAdvance(null, STAGE_ADVANCE_AFTER_WRONG_MS);
        }
        return result;
      }

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
    if (session.currentStageActionBarVariant === "gated") {
      toast.warning("Wykonaj ćwiczenie, zanim przejdziesz dalej.");
      return;
    }
    handleCheck();
  }

  function resetExercise() {
    clearAdvanceTimeout();
    autoAdvancedStagesRef.current.clear();
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
  }

  function advanceCurrentStage() {
    clearAdvanceTimeout();
    if (isLastStage) {
      return;
    }

    persistStageCompletionFeedback(controller.setFeedback, feedback);
    autoAdvancedStagesRef.current.add(currentStageIndex);
    advanceStage();
    setShowCelebration(false);
  }

  function goToPreviousStage() {
    clearAdvanceTimeout();
    navigation.goToPreviousStage();
    setShowCelebration(false);
  }

  const isGatedStage = session.currentStageActionBarVariant === "gated";
  const isLocked =
    feedback === "stageSuccess" ||
    feedback === "stageSolution" ||
    feedback === "stageCloseCall" ||
    (isLastStage && (feedback === "success" || feedback === "solution"));

  const canProceed =
    isLastStage &&
    session.isExerciseComplete &&
    session.isCurrentStageComplete &&
    (isGatedStage
      ? true
      : feedback === "success" ||
        feedback === "solution" ||
        feedback === "stageCloseCall");

  const canProceedStage =
    !isLastStage &&
    (feedback === "stageSuccess" ||
      feedback === "stageSolution" ||
      session.isCurrentStageComplete);

  const canGoBack =
    flowPhase === "main" && currentStageIndex > 0 && !isLocked;

  const value: ExerciseSessionContextValue = {
    controller,
    feedback,
    showCelebration,
    isLocked,
    canProceed,
    actionBarMode: "multi-stage",
    hints: isGatedStage ? [] : hints,
    stageProgress,
    canGoBack,
    goToPreviousStage,
    reset: resetExercise,
    handleCheck,
    handleProceedAttempt,
    tryShowSolution: isGatedStage ? () => {} : tryShowSolution,
    showHintDialog: isGatedStage ? () => {} : () => setHintOpen(true),
    currentStageActionBarVariant: session.currentStageActionBarVariant,
    advanceCurrentStage,
    canProceedStage,
  };

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
