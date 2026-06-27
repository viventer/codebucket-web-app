"use client";

import { useCallback } from "react";

import { isFillCodeStage } from "../stage-utils";
import type { MultiStageCoreContext, MultiStageFillCodeStage } from "../types";

export function useFillCodeStage(
  ctx: MultiStageCoreContext,
): MultiStageFillCodeStage | null {
  const { currentStage, currentState, updateCurrentStageState } = ctx;

  const fillCodeStage =
    currentState.kind === "fillCode" && isFillCodeStage(currentStage)
      ? currentStage
      : null;

  const updateGap = useCallback(
    (gapId: string, value: string) => {
      if (!fillCodeStage || currentState.kind !== "fillCode") {
        return;
      }

      updateCurrentStageState((state) => {
        if (state.kind !== "fillCode") {
          return state;
        }

        return {
          ...state,
          assignments: {
            ...state.assignments,
            [gapId]: value === "" ? null : value,
          },
        };
      });
    },
    [currentState.kind, fillCodeStage, updateCurrentStageState],
  );

  const setActiveGapId = useCallback(
    (gapId: string | null) => {
      updateCurrentStageState((state) => {
        if (state.kind !== "fillGaps" && state.kind !== "fillCode") {
          return state;
        }

        return {
          ...state,
          activeGapId: gapId,
        };
      });
    },
    [updateCurrentStageState],
  );

  if (!fillCodeStage || currentState.kind !== "fillCode") {
    return null;
  }

  return {
    type: "fillCode",
    assignments: currentState.assignments,
    activeGapId: currentState.activeGapId,
    updateGap,
    setActiveGapId,
  };
}
