"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ExerciseHintDialog } from "@/components/course/exercises/ExerciseHintDialog";
import { ExerciseSolutionDialog } from "@/components/course/exercises/ExerciseSolutionDialog";
import { SuccessCelebration } from "@/components/course/exercises/SuccessCelebration";
import { toast } from "@/hooks/use-toast";
import type { CourseElement } from "@/schemas/courseSchema";

import {
  getExerciseHints,
  getFillGapsExerciseConfig,
} from "./create-exercise-controller";
import { useFillGapsExerciseController } from "./fill-gaps-controller";
import type {
  CheckResult,
  ExerciseFeedback,
  FillGapsExerciseController,
} from "./types";

const TRANSIENT_FEEDBACK_MS = 3000;

type ExerciseSessionContextValue = {
  controller: FillGapsExerciseController | null;
  feedback: ExerciseFeedback;
  showCelebration: boolean;
  isLocked: boolean;
  canProceed: boolean;
  hints: string[];
  reset: () => void;
  handleCheck: () => CheckResult | null;
  tryShowSolution: () => void;
  showHintDialog: () => void;
};

const ExerciseSessionContext =
  createContext<ExerciseSessionContextValue | null>(null);

function FillGapsSessionBridge({
  config,
  children,
  hints,
}: {
  config: NonNullable<ReturnType<typeof getFillGapsExerciseConfig>>;
  children: ReactNode;
  hints: string[];
}) {
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

  const handleCheck = useCallback((): CheckResult | null => {
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
      return result;
    }

    controller.setFeedback("warning");
    toast.warning("Dokończ zadanie przed sprawdzeniem.");
    return result;
  }, [controller]);

  const resetExercise = useCallback(() => {
    controller.reset();
    setShowCelebration(false);
    toast.info("Zadanie zostało przywrócone do stanu początkowego.");
  }, [controller]);

  useEffect(() => {
    if (!showCelebration) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowCelebration(false);
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [showCelebration]);

  const tryShowSolution = useCallback(() => {
    if (!controller.hasAttemptedCheck) {
      toast.warning("Spróbuj najpierw wykonać zadanie samodzielnie.");
      return;
    }
    setSolutionOpen(true);
  }, [controller.hasAttemptedCheck]);

  const confirmSolution = useCallback(() => {
    controller.applySolution();
    controller.setFeedback("solution");
    setSolutionOpen(false);
    toast.success("Poprawna odpowiedź została wstawiona.");
  }, [controller]);

  const isLocked = feedback === "success" || feedback === "solution";
  const canProceed = isLocked;

  const value = useMemo<ExerciseSessionContextValue>(
    () => ({
      controller,
      feedback,
      showCelebration,
      isLocked,
      canProceed,
      hints,
      reset: resetExercise,
      handleCheck,
      tryShowSolution,
      showHintDialog: () => setHintOpen(true),
    }),
    [
      controller,
      feedback,
      handleCheck,
      hints,
      isLocked,
      canProceed,
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

export function ExerciseSessionProvider({
  element,
  children,
}: {
  element: CourseElement;
  children: ReactNode;
}) {
  const hints = getExerciseHints(element);
  const fillGapsConfig = getFillGapsExerciseConfig(element);

  if (fillGapsConfig) {
    return (
      <FillGapsSessionBridge config={fillGapsConfig} hints={hints}>
        {children}
      </FillGapsSessionBridge>
    );
  }

  return (
    <ExerciseSessionContext.Provider
      value={{
        controller: null,
        feedback: "idle",
        showCelebration: false,
        isLocked: false,
        canProceed: false,
        hints,
        reset: () => {},
        handleCheck: () => null,
        tryShowSolution: () => {},
        showHintDialog: () => {},
      }}
    >
      {children}
    </ExerciseSessionContext.Provider>
  );
}

export function useExerciseSession(): ExerciseSessionContextValue {
  const context = useContext(ExerciseSessionContext);
  if (!context) {
    throw new Error(
      "useExerciseSession must be used within ExerciseSessionProvider",
    );
  }
  return context;
}
