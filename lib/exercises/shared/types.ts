import type { MatchPairItemState } from "./item-glow-style";
import type { MultiStageContent } from "@/schemas/courseSchema";

import type {
  MultiStageActiveStage,
  MultiStageNavigation,
  MultiStageSessionMeta,
} from "../multi-stage/types";

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

export interface FillCodeControllerState {
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  updateGap: (gapId: string, value: string) => void;
  setActiveGapId: (gapId: string | null) => void;
}

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

export type MultiStageExerciseController = ExerciseController & {
  kind: "multiStage";
  content: MultiStageContent;
  navigation: MultiStageNavigation;
  session: MultiStageSessionMeta;
  stage: MultiStageActiveStage;
};

export type ExerciseControllerUnion = MultiStageExerciseController;

export type ActionBarMode = "multi-stage";
