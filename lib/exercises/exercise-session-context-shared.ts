"use client";

import { createContext } from "react";

import type {
  ActionBarMode,
  CheckResult,
  ExerciseControllerUnion,
  ExerciseFeedback,
} from "./types";

export type ExerciseSessionContextValue = {
  controller: ExerciseControllerUnion | null;
  feedback: ExerciseFeedback;
  showCelebration: boolean;
  isLocked: boolean;
  canProceed: boolean;
  actionBarMode: ActionBarMode;
  hints: string[];
  reset: () => void;
  handleCheck: () => CheckResult | null;
  handleProceedAttempt: () => void;
  tryShowSolution: () => void;
  showHintDialog: () => void;
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
  reset: () => {},
  handleCheck: () => null,
  handleProceedAttempt: () => {},
  tryShowSolution: () => {},
  showHintDialog: () => {},
};
