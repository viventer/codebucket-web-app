import type { Dispatch, SetStateAction } from "react";

import type {
  MultiStageContent,
  MultiStageStage,
  SelectCorrectPrompt,
} from "@/schemas/courseSchema";

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
  MultiStageFlowPhase,
  StageActionBarVariant,
  StageProgress,
} from "../shared/types";

import type { StageState } from "./stage-state";

export type MultiStageCoreContext = {
  content: MultiStageContent;
  currentStageIndex: number;
  currentStage: MultiStageStage;
  currentState: StageState;
  stageStates: StageState[];
  shuffleToken: number;
  updateCurrentStageState: (updater: (state: StageState) => StageState) => void;
  bumpShuffleToken: (stageIndex: number) => void;
  setRetryQueue: Dispatch<SetStateAction<number[]>>;
};

export type MultiStageSelectCorrectStage = {
  type: "selectCorrect";
  question: string;
  prompt?: SelectCorrectPrompt;
  persisted: SelectCorrectPersistedState;
  shuffledAnswers: { id: number; content: string }[];
  selectAnswer: (answerId: number) => void;
  getAnswerVisualState: (answerId: number) => SelectCorrectAnswerVisualState;
  getWrongExplanation: () => string | null;
};

export type MultiStageChooseMatchingStage = {
  type: "chooseMatching";
  command: string;
  persisted: ChooseMatchingPersistedState;
  shuffledItems: { id: number; content: string }[];
  toggleItem: (itemId: number) => void;
  getItemVisualState: (itemId: number) => ChooseMatchingItemVisualState;
};

export type MultiStageFillGapsStage = {
  type: "fillGaps";
} & FillGapsControllerState;

export type MultiStageFillCodeStage = {
  type: "fillCode";
} & FillCodeControllerState;

export type MultiStageMatchPairsStage = {
  type: "matchPairs";
} & MatchPairsControllerState;

export type MultiStageActiveStage =
  | MultiStageFillGapsStage
  | MultiStageFillCodeStage
  | MultiStageMatchPairsStage
  | MultiStageSelectCorrectStage
  | MultiStageChooseMatchingStage;

export type MultiStageNavigation = {
  currentStageIndex: number;
  currentStage: MultiStageStage;
  flowPhase: MultiStageFlowPhase;
  stageProgress: StageProgress;
  isLastStage: boolean;
  advanceStage: () => void;
  goToPreviousStage: () => void;
};

export type MultiStageSessionMeta = {
  isExerciseComplete: boolean;
  isCurrentStageComplete: boolean;
  currentStageActionBarVariant: StageActionBarVariant;
  feedbackTarget: StageFeedbackTarget;
};
