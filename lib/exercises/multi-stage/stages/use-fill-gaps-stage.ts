"use client";

import { useCallback } from "react";

import { useShuffledItems } from "@/lib/shuffle";

import {
  getAvailableOptions,
  getFirstEmptyGapId,
  getGapIds,
} from "../../fill-gaps/fill-gaps-utils";
import { isFillGapsStage } from "../stage-utils";
import { EMPTY_FILL_GAPS_OPTIONS } from "../stage-state";
import type { MultiStageCoreContext, MultiStageFillGapsStage } from "../types";

export function useFillGapsStage(
  ctx: MultiStageCoreContext,
): MultiStageFillGapsStage | null {
  const { currentStage, currentState, shuffleToken, updateCurrentStageState } =
    ctx;

  const fillGapsStage =
    currentState.kind === "fillGaps" && isFillGapsStage(currentStage)
      ? currentStage
      : null;

  const optionOrder = useShuffledItems(
    fillGapsStage?.options ?? EMPTY_FILL_GAPS_OPTIONS,
    currentState.kind === "fillGaps" ? shuffleToken : 0,
  );

  const availableOptions =
    fillGapsStage && currentState.kind === "fillGaps"
      ? getAvailableOptions(
          { ...fillGapsStage, options: optionOrder },
          currentState.assignments,
        )
      : [];

  const selectOption = useCallback(
    (option: string) => {
      if (!fillGapsStage || currentState.kind !== "fillGaps") {
        return;
      }

      const gapIds = getGapIds(fillGapsStage);
      updateCurrentStageState((state) => {
        if (state.kind !== "fillGaps" || !state.activeGapId) {
          return state;
        }

        const assignments = {
          ...state.assignments,
          [state.activeGapId]: option,
        };

        return {
          ...state,
          assignments,
          activeGapId: getFirstEmptyGapId(gapIds, assignments),
        };
      });
    },
    [currentState.kind, fillGapsStage, updateCurrentStageState],
  );

  const clearGap = useCallback(
    (gapId: string) => {
      updateCurrentStageState((state) => {
        if (state.kind !== "fillGaps") {
          return state;
        }

        return {
          ...state,
          assignments: {
            ...state.assignments,
            [gapId]: null,
          },
          activeGapId: gapId,
        };
      });
    },
    [updateCurrentStageState],
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

  if (!fillGapsStage || currentState.kind !== "fillGaps") {
    return null;
  }

  return {
    type: "fillGaps",
    assignments: currentState.assignments,
    activeGapId: currentState.activeGapId,
    availableOptions,
    selectOption,
    clearGap,
    setActiveGapId,
  };
}
