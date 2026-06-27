import type { MatchPairItemState } from "./item-glow-style";
import type {
  MultiStageContent,
  SelectCorrectContent,
} from "@/schemas/courseSchema";

import type {
  MultiStageActiveStage,
  MultiStageNavigation,
  MultiStageSessionMeta,
} from "../multi-stage/types";
import type {
  SelectCorrectAnswerVisualState,
  SelectCorrectPhase,
} from "../select-correct/select-correct-state";

export type CheckResult = "success" | "error" | "warning";

export type ExerciseFeedback =
  | "idle"
  | "success"
  | "stageSuccess"
  | "stageSolution"
  | "stageWrongFirst"
  | "stageWrongRetry"
  | "stageCloseCall"
  | "error"
  | "warning"
  | "solution";

export type MultiStageFlowPhase = "main" | "retry";

export type StageProgress = {
  current: number;
  total: number;
};

export type StageActionBarVariant = "gated" | "check";

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

export interface FillCodeControllerState {
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  updateGap: (gapId: string, value: string) => void;
  setActiveGapId: (gapId: string | null) => void;
}

export type FillCodeExerciseController = ExerciseController &
  FillCodeControllerState & {
    kind: "fillCode";
  };

export type MatchPairsColumn = "left" | "right";

export type MatchPairSelection = {
  column: MatchPairsColumn;
  id: string;
};

export type MatchPairsItem = {
  id: string;
  text: string;
  pairId: string;
};

export interface MatchPairsControllerState {
  leftItems: MatchPairsItem[];
  rightItems: MatchPairsItem[];
  selected: MatchPairSelection | null;
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

export interface SelectCorrectControllerState {
  content: SelectCorrectContent;
  shuffledAnswers: { id: number; content: string }[];
  selectedAnswerId: number | null;
  phase: SelectCorrectPhase;
  isLocked: boolean;
  isComplete: boolean;
  selectAnswer: (answerId: number) => void;
  getAnswerVisualState: (answerId: number) => SelectCorrectAnswerVisualState;
  getWrongExplanation: () => string | null;
}

export type SelectCorrectExerciseController = ExerciseController &
  SelectCorrectControllerState & {
    kind: "selectCorrect";
  };

export type MultiStageExerciseController = ExerciseController & {
  kind: "multiStage";
  content: MultiStageContent;
  navigation: MultiStageNavigation;
  session: MultiStageSessionMeta;
  stage: MultiStageActiveStage;
};

export type ExerciseControllerUnion =
  | FillGapsExerciseController
  | FillCodeExerciseController
  | MultiStageExerciseController
  | MatchPairsExerciseController
  | SelectCorrectExerciseController;

export type ActionBarMode = "check-first" | "back-next-gated" | "multi-stage";
