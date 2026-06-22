import type { MatchPairItemState } from "./item-glow-style";
import type {
  MultiStageFillGapsContent,
  MultiStageFillGapsStage,
} from "@/schemas/courseSchema";

import type { StageFeedbackTarget } from "./fill-gaps-utils";

export type CheckResult = "success" | "error" | "warning";

export type ExerciseFeedback =
  | "idle"
  | "success"
  | "stageSuccess"
  | "error"
  | "warning"
  | "solution";

export type StageProgress = {
  current: number;
  total: number;
};

export interface ExerciseController {
  check: () => CheckResult;
  applySolution: () => void;
  reset: () => void;
  getHints: () => string[];
  hasAttemptedCheck: boolean;
  feedback: ExerciseFeedback;
  markAttempted: () => void;
  setFeedback: (feedback: ExerciseFeedback) => void;
  clearTransientFeedback: () => void;
}

export interface FillGapsControllerState {
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  availableOptions: string[];
  selectOption: (option: string) => void;
  clearGap: (gapId: string) => void;
  setActiveGapId: (gapId: string | null) => void;
}

export type FillGapsExerciseController = ExerciseController &
  FillGapsControllerState & {
    kind: "fillGaps";
  };

export type MatchPairsColumn = "left" | "right";

export type MatchPairsItem = {
  id: string;
  text: string;
  pairId: string;
};

export interface MatchPairsControllerState {
  leftItems: MatchPairsItem[];
  rightItems: MatchPairsItem[];
  selected: { column: MatchPairsColumn; id: string } | null;
  matchedPairIds: Set<string>;
  isComplete: boolean;
  selectItem: (column: MatchPairsColumn, id: string) => void;
  getItemState: (itemId: string) => MatchPairItemState;
  isErrorFlashing: (itemId: string) => boolean;
}

export type MatchPairsExerciseController = ExerciseController &
  MatchPairsControllerState & {
    kind: "matchPairs";
  };

export interface MultiStageFillGapsControllerState {
  content: MultiStageFillGapsContent;
  currentStageIndex: number;
  currentStage: MultiStageFillGapsStage;
  stageProgress: StageProgress;
  feedbackTarget: StageFeedbackTarget;
  isLastStage: boolean;
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  availableOptions: string[];
  selectOption: (option: string) => void;
  clearGap: (gapId: string) => void;
  setActiveGapId: (gapId: string | null) => void;
  advanceStage: () => void;
  goToPreviousStage: () => void;
}

export type MultiStageFillGapsExerciseController = ExerciseController &
  MultiStageFillGapsControllerState & {
    kind: "multiStageFillGaps";
  };

export type ExerciseControllerUnion =
  | FillGapsExerciseController
  | MultiStageFillGapsExerciseController
  | MatchPairsExerciseController;

export type ActionBarMode = "check-first" | "back-next-gated" | "multi-stage";
