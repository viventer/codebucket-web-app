import type { Dispatch, SetStateAction } from "react";

import type {
  ExerciseStage,
  InteractiveExerciseContent,
  SelectCorrectPrompt,
} from "@/schemas/exerciseSchema";

import type {
  ChooseMatchingItemVisualState,
  ChooseMatchingPersistedState,
} from "../choose-matching/choose-matching-state";
import type { StageFeedbackTarget } from "../fill-gaps/fill-gaps-utils";
import type {
  SelectCorrectAnswerVisualState,
  SelectCorrectPersistedState,
} from "../select-correct/select-correct-state";
import type {
  FillCodeControllerState,
  FillGapsControllerState,
  MatchPairsControllerState,
  InteractiveExerciseFlowPhase,
  StageActionBarVariant,
  StageProgress,
} from "../shared/types";

import type { StageState } from "./stage-state";

export type InteractiveExerciseContext = {
  content: InteractiveExerciseContent;
  currentStageIndex: number;
  currentStage: ExerciseStage;
  currentState: StageState;
  stageStates: StageState[];
  shuffleToken: number;
  updateCurrentStageState: (updater: (state: StageState) => StageState) => void;
  bumpShuffleToken: (stageIndex: number) => void;
  setRetryQueue: Dispatch<SetStateAction<number[]>>;
};

export type InteractiveExerciseSelectCorrectStage = {
  type: "selectCorrect";
  question: string;
  prompt?: SelectCorrectPrompt;
  persisted: SelectCorrectPersistedState;
  shuffledAnswers: { id: number; content: string }[];
  selectAnswer: (answerId: number) => void;
  getAnswerVisualState: (answerId: number) => SelectCorrectAnswerVisualState;
  getWrongExplanation: () => string | null;
};

export type InteractiveExerciseChooseMatchingStage = {
  type: "chooseMatching";
  command: string;
  persisted: ChooseMatchingPersistedState;
  shuffledItems: { id: number; content: string }[];
  toggleItem: (itemId: number) => void;
  getItemVisualState: (itemId: number) => ChooseMatchingItemVisualState;
};

export type InteractiveExerciseFillGapsStage = {
  type: "fillGaps";
} & FillGapsControllerState;

export type InteractiveExerciseFillCodeStage = {
  type: "fillCode";
} & FillCodeControllerState;

export type InteractiveExerciseMatchPairsStage = {
  type: "matchPairs";
} & MatchPairsControllerState;

export type InteractiveExerciseActiveStage =
  | InteractiveExerciseFillGapsStage
  | InteractiveExerciseFillCodeStage
  | InteractiveExerciseMatchPairsStage
  | InteractiveExerciseSelectCorrectStage
  | InteractiveExerciseChooseMatchingStage;

export type InteractiveExerciseNavigation = {
  currentStageIndex: number;
  currentStage: ExerciseStage;
  flowPhase: InteractiveExerciseFlowPhase;
  stageProgress: StageProgress;
  isLastStage: boolean;
  advanceStage: () => void;
  goToPreviousStage: () => void;
};

export type InteractiveExerciseSessionMeta = {
  isExerciseComplete: boolean;
  isCurrentStageComplete: boolean;
  currentStageActionBarVariant: StageActionBarVariant;
  feedbackTarget: StageFeedbackTarget;
};
