import type {
  FillCodeStage,
  FillGapsStage,
  MatchPairsStage,
  MultiStageContent,
  MultiStageStage,
} from "@/schemas/courseSchema";

import {
  createInitialChooseMatchingState,
  type ChooseMatchingPersistedState,
} from "../choose-matching/choose-matching-state";
import {
  createInitialAssignments,
  getGapIds,
} from "../fill-gaps/fill-gaps-utils";
import {
  buildMatchPairItems,
  createInitialMatchPairItemStates,
} from "../match-pairs/match-pairs-state";
import {
  createInitialSelectCorrectState,
  type SelectCorrectPersistedState,
} from "../select-correct/select-correct-state";
import type { MatchPairItemState } from "../shared/item-glow-style";
import type { ExerciseFeedback, MatchPairSelection } from "../shared/types";

export const EMPTY_FILL_GAPS_OPTIONS: readonly string[] = [];
export const EMPTY_SELECT_CORRECT_ANSWERS: readonly {
  id: number;
  content: string;
}[] = [];
export const EMPTY_CHOOSE_MATCHING_ITEMS: readonly {
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

export type FillCodeStageState = {
  kind: "fillCode";
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

export type ChooseMatchingStageState = {
  kind: "chooseMatching";
  chooseMatching: ChooseMatchingPersistedState;
  feedback: ExerciseFeedback;
  firstAttemptWrong: boolean;
  retryCompleted: boolean;
};

export type MatchPairsStageState = {
  kind: "matchPairs";
  selected: MatchPairSelection | null;
  matchedPairIds: Set<string>;
  itemStates: Record<string, MatchPairItemState>;
  errorFlashIds: Set<string>;
  isComplete: boolean;
  feedback: ExerciseFeedback;
};

export type StageState =
  | FillGapsStageState
  | FillCodeStageState
  | SelectCorrectStageState
  | ChooseMatchingStageState
  | MatchPairsStageState;

export function createFillGapsStageState(
  stage: FillGapsStage,
): FillGapsStageState {
  const gapIds = getGapIds(stage);
  return {
    kind: "fillGaps",
    assignments: createInitialAssignments(gapIds),
    activeGapId: gapIds[0] ?? null,
    hasAttemptedCheck: false,
    feedback: "idle",
  };
}

export function createFillCodeStageState(
  stage: FillCodeStage,
): FillCodeStageState {
  const gapIds = getGapIds(stage);
  return {
    kind: "fillCode",
    assignments: createInitialAssignments(gapIds),
    activeGapId: gapIds[0] ?? null,
    hasAttemptedCheck: false,
    feedback: "idle",
  };
}

export function createMatchPairsStageState(
  stage: MatchPairsStage,
): MatchPairsStageState {
  const leftItems = buildMatchPairItems(stage, "left");
  const rightItems = buildMatchPairItems(stage, "right");

  return {
    kind: "matchPairs",
    selected: null,
    matchedPairIds: new Set(),
    itemStates: createInitialMatchPairItemStates(leftItems, rightItems),
    errorFlashIds: new Set(),
    isComplete: false,
    feedback: "idle",
  };
}

export function createChooseMatchingStageState(): ChooseMatchingStageState {
  return {
    kind: "chooseMatching",
    chooseMatching: createInitialChooseMatchingState(),
    feedback: "idle",
    firstAttemptWrong: false,
    retryCompleted: false,
  };
}

export function createStageState(stage: MultiStageStage): StageState {
  if (stage.type === "fillGaps") {
    return createFillGapsStageState(stage);
  }

  if (stage.type === "fillCode") {
    return createFillCodeStageState(stage);
  }

  if (stage.type === "matchPairs") {
    return createMatchPairsStageState(stage);
  }

  if (stage.type === "chooseMatching") {
    return createChooseMatchingStageState();
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
