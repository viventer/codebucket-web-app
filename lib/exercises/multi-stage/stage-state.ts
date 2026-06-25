import type { FillGapsStage, MultiStageContent, MultiStageStage } from "@/schemas/courseSchema";

import {
  createInitialAssignments,
  getGapIds,
} from "../fill-gaps/fill-gaps-utils";
import {
  createInitialSelectCorrectState,
  type SelectCorrectPersistedState,
} from "../select-correct/select-correct-state";
import type { ExerciseFeedback } from "../shared/types";

export const EMPTY_FILL_GAPS_OPTIONS: readonly string[] = [];
export const EMPTY_SELECT_CORRECT_ANSWERS: readonly {
  id: number;
  content: string;
}[] = [];

export type FillGapsStageState = {
  kind: "fillGaps";
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  hasAttemptedCheck: boolean;
  feedback: ExerciseFeedback;
};

export type SelectCorrectStageState = {
  kind: "selectCorrect";
  selectCorrect: SelectCorrectPersistedState;
  feedback: ExerciseFeedback;
  firstAttemptWrong: boolean;
  retryCompleted: boolean;
};

export type StageState = FillGapsStageState | SelectCorrectStageState;

export function createFillGapsStageState(stage: FillGapsStage): FillGapsStageState {
  const gapIds = getGapIds(stage);
  return {
    kind: "fillGaps",
    assignments: createInitialAssignments(gapIds),
    activeGapId: gapIds[0] ?? null,
    hasAttemptedCheck: false,
    feedback: "idle",
  };
}

export function createStageState(stage: MultiStageStage): StageState {
  if (stage.type === "fillGaps") {
    return createFillGapsStageState(stage);
  }

  return {
    kind: "selectCorrect",
    selectCorrect: createInitialSelectCorrectState(),
    feedback: "idle",
    firstAttemptWrong: false,
    retryCompleted: false,
  };
}

export function createAllStageStates(content: MultiStageContent): StageState[] {
  return content.stages.map((stage) => createStageState(stage));
}
