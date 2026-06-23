"use client";

import { useContext, type ReactNode } from "react";

import type { CourseElement } from "@/schemas/courseSchema";

import {
  getExerciseHints,
  getFillCodeExerciseConfig,
  getFillGapsExerciseConfig,
  getMatchPairsExerciseConfig,
  getMultiStageFillGapsExerciseConfig,
} from "./create-exercise-controller";
import {
  EMPTY_SESSION_VALUE,
  ExerciseSessionContext,
  type ExerciseSessionContextValue,
} from "./exercise-session-context-shared";
import { FillCodeSessionBridge } from "./fill-code-session-bridge";
import { FillGapsSessionBridge } from "./fill-gaps-session-bridge";
import { MatchPairsSessionBridge } from "./match-pairs-session-bridge";
import { MultiStageFillGapsSessionBridge } from "./multi-stage-fill-gaps-session-bridge";

export function ExerciseSessionProvider({
  element,
  children,
}: {
  element: CourseElement;
  children: ReactNode;
}) {
  const hints = getExerciseHints(element);
  const fillGapsConfig = getFillGapsExerciseConfig(element);
  const fillCodeConfig = getFillCodeExerciseConfig(element);
  const multiStageFillGapsConfig =
    getMultiStageFillGapsExerciseConfig(element);
  const matchPairsConfig = getMatchPairsExerciseConfig(element);

  if (fillGapsConfig) {
    return (
      <FillGapsSessionBridge config={fillGapsConfig} hints={hints}>
        {children}
      </FillGapsSessionBridge>
    );
  }

  if (fillCodeConfig) {
    return (
      <FillCodeSessionBridge config={fillCodeConfig} hints={hints}>
        {children}
      </FillCodeSessionBridge>
    );
  }

  if (multiStageFillGapsConfig) {
    return (
      <MultiStageFillGapsSessionBridge
        config={multiStageFillGapsConfig}
        hints={hints}
      >
        {children}
      </MultiStageFillGapsSessionBridge>
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

export function useExerciseSessionOptional(): ExerciseSessionContextValue | null {
  return useContext(ExerciseSessionContext);
}

export type {
  FillCodeExerciseController,
  FillGapsExerciseController,
  MatchPairsExerciseController,
  MultiStageFillGapsExerciseController,
} from "./types";
