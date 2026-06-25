"use client";

import { useContext, type ReactNode } from "react";

import type { CourseElement } from "@/schemas/courseSchema";

import { FillCodeSessionBridge } from "../fill-code/fill-code-session-bridge";
import { FillGapsSessionBridge } from "../fill-gaps/fill-gaps-session-bridge";
import { MatchPairsSessionBridge } from "../match-pairs/match-pairs-session-bridge";
import { MultiStageSessionBridge } from "../multi-stage/multi-stage-session-bridge";
import { SelectCorrectSessionBridge } from "../select-correct/select-correct-session-bridge";
import {
  getExerciseHints,
  getFillCodeExerciseConfig,
  getFillGapsExerciseConfig,
  getMatchPairsExerciseConfig,
  getMultiStageExerciseConfig,
  getSelectCorrectExerciseConfig,
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
  const fillGapsConfig = getFillGapsExerciseConfig(element);
  const fillCodeConfig = getFillCodeExerciseConfig(element);
  const multiStageConfig = getMultiStageExerciseConfig(element);
  const matchPairsConfig = getMatchPairsExerciseConfig(element);
  const selectCorrectConfig = getSelectCorrectExerciseConfig(element);

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

  if (multiStageConfig) {
    return (
      <MultiStageSessionBridge config={multiStageConfig} hints={hints}>
        {children}
      </MultiStageSessionBridge>
    );
  }

  if (matchPairsConfig) {
    return (
      <MatchPairsSessionBridge config={matchPairsConfig}>
        {children}
      </MatchPairsSessionBridge>
    );
  }

  if (selectCorrectConfig) {
    return (
      <SelectCorrectSessionBridge config={selectCorrectConfig}>
        {children}
      </SelectCorrectSessionBridge>
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
  MultiStageExerciseController,
  SelectCorrectExerciseController,
} from "../shared/types";
