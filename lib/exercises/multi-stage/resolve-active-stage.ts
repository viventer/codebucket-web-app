import type { StageState } from "./stage-state";
import type {
  MultiStageActiveStage,
  MultiStageChooseMatchingStage,
  MultiStageFillCodeStage,
  MultiStageFillGapsStage,
  MultiStageMatchPairsStage,
  MultiStageSelectCorrectStage,
} from "./types";

type StageSlices = {
  fillGaps: MultiStageFillGapsStage | null;
  fillCode: MultiStageFillCodeStage | null;
  matchPairs: MultiStageMatchPairsStage | null;
  selectCorrect: MultiStageSelectCorrectStage | null;
  chooseMatching: MultiStageChooseMatchingStage | null;
};

export function resolveActiveStage(
  currentState: StageState,
  slices: StageSlices,
): MultiStageActiveStage {
  switch (currentState.kind) {
    case "fillGaps":
      if (!slices.fillGaps) {
        throw new Error("Missing fillGaps stage slice");
      }
      return slices.fillGaps;
    case "fillCode":
      if (!slices.fillCode) {
        throw new Error("Missing fillCode stage slice");
      }
      return slices.fillCode;
    case "matchPairs":
      if (!slices.matchPairs) {
        throw new Error("Missing matchPairs stage slice");
      }
      return slices.matchPairs;
    case "selectCorrect":
      if (!slices.selectCorrect) {
        throw new Error("Missing selectCorrect stage slice");
      }
      return slices.selectCorrect;
    case "chooseMatching":
      if (!slices.chooseMatching) {
        throw new Error("Missing chooseMatching stage slice");
      }
      return slices.chooseMatching;
    default: {
      const _exhaustive: never = currentState;
      throw new Error(`Unknown stage kind: ${(_exhaustive as StageState).kind}`);
    }
  }
}
