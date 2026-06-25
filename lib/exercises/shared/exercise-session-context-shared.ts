"use client";

import { createContext } from "react";

import type {
  ActionBarMode,
  CheckResult,
  ExerciseControllerUnion,
  ExerciseFeedback,
  StageActionBarVariant,
  StageProgress,
} from "./types";

export type ExerciseSessionContextValue = {
  controller: ExerciseControllerUnion | null;
  feedback: ExerciseFeedback;
  showCelebration: boolean;
  isLocked: boolean;
  canProceed: boolean;
  actionBarMode: ActionBarMode;
  hints: string[];
  stageProgress: StageProgress | null;
  canGoBack: boolean;
  goToPreviousStage: () => void;
  reset: () => void;
  handleCheck: () => CheckResult | null;
  handleProceedAttempt: () => void;
  tryShowSolution: () => void;
  showHintDialog: () => void;
  currentStageActionBarVariant: StageActionBarVariant | null;
  advanceCurrentStage: () => void;
  canProceedStage: boolean;
};

export const ExerciseSessionContext =
  createContext<ExerciseSessionContextValue | null>(null);

export const EMPTY_SESSION_VALUE: ExerciseSessionContextValue = {
  controller: null,
  feedback: "idle",
  showCelebration: false,
  isLocked: false,
  canProceed: false,
  actionBarMode: "check-first",
  hints: [],
  stageProgress: null,
  canGoBack: false,
  goToPreviousStage: () => {},
  reset: () => {},
  handleCheck: () => null,
  handleProceedAttempt: () => {},
  tryShowSolution: () => {},
  showHintDialog: () => {},
  currentStageActionBarVariant: null,
  advanceCurrentStage: () => {},
  canProceedStage: false,
};
