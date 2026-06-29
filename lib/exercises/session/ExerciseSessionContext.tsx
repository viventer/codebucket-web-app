"use client";

import { useContext, type ReactNode } from "react";

import type { CourseElement } from "@/schemas/courseSchema";

import { InteractiveExerciseSessionBridge } from "../interactive/interactive-exercise-session-bridge";
import { LocalCodeExerciseSessionBridge } from "../local/local-code-exercise-session-bridge";
import {
  getExerciseHints,
  getInteractiveExerciseConfig,
  getLocalCodeExerciseConfig,
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
  const interactiveConfig = getInteractiveExerciseConfig(element);
  const localCodeConfig = getLocalCodeExerciseConfig(element);

  if (interactiveConfig) {
    return (
      <InteractiveExerciseSessionBridge config={interactiveConfig} hints={hints}>
        {children}
      </InteractiveExerciseSessionBridge>
    );
  }

  if (localCodeConfig) {
    return (
      <LocalCodeExerciseSessionBridge config={localCodeConfig} hints={hints}>
        {children}
      </LocalCodeExerciseSessionBridge>
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

export type { InteractiveExerciseController } from "../shared/types";
