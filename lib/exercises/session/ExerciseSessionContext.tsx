"use client";

import { useContext, type ReactNode } from "react";

import type { CourseElement } from "@/schemas/courseSchema";

import { MultiStageSessionBridge } from "../multi-stage/multi-stage-session-bridge";
import {
  getExerciseHints,
  getMultiStageExerciseConfig,
} from "../shared/create-exercise-controller";
import {
  EMPTY_SESSION_VALUE,
  ExerciseSessionContext,
  type ExerciseSessionContextValue,
} from "../shared/exercise-session-context-shared";

export function ExerciseSessionProvider({
  element,
  children,
}: {
  element: CourseElement;
  children: ReactNode;
}) {
  const hints = getExerciseHints(element);
  const multiStageConfig = getMultiStageExerciseConfig(element);

  if (multiStageConfig) {
    return (
      <MultiStageSessionBridge config={multiStageConfig} hints={hints}>
        {children}
      </MultiStageSessionBridge>
    );
  }

  return (
    <ExerciseSessionContext.Provider
      value={{ ...EMPTY_SESSION_VALUE, hints }}
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

export function useExerciseSessionOptional(): ExerciseSessionContextValue | null {
  return useContext(ExerciseSessionContext);
}

export type { MultiStageExerciseController } from "../shared/types";
