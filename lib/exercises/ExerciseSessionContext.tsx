"use client";

import { useContext, type ReactNode } from "react";

import type { CourseElement } from "@/schemas/courseSchema";

import {
  getExerciseHints,
  getFillGapsExerciseConfig,
  getMatchPairsExerciseConfig,
} from "./create-exercise-controller";
import {
  EMPTY_SESSION_VALUE,
  ExerciseSessionContext,
  type ExerciseSessionContextValue,
} from "./exercise-session-context-shared";
import { FillGapsSessionBridge } from "./fill-gaps-session-bridge";
import { MatchPairsSessionBridge } from "./match-pairs-session-bridge";

export function ExerciseSessionProvider({
  element,
  children,
}: {
  element: CourseElement;
  children: ReactNode;
}) {
  const hints = getExerciseHints(element);
  const fillGapsConfig = getFillGapsExerciseConfig(element);
  const matchPairsConfig = getMatchPairsExerciseConfig(element);

  if (fillGapsConfig) {
    return (
      <FillGapsSessionBridge config={fillGapsConfig} hints={hints}>
        {children}
      </FillGapsSessionBridge>
    );
  }

  if (matchPairsConfig) {
    return (
      <MatchPairsSessionBridge config={matchPairsConfig}>
        {children}
      </MatchPairsSessionBridge>
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

export type {
  FillGapsExerciseController,
  MatchPairsExerciseController,
} from "./types";
