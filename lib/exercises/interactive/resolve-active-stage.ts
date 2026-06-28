import type { StageState } from "./stage-state";
import type {
  InteractiveExerciseActiveStage,
  InteractiveExerciseChooseMatchingStage,
  InteractiveExerciseFillCodeStage,
  InteractiveExerciseFillGapsStage,
  InteractiveExerciseMatchPairsStage,
  InteractiveExerciseSelectCorrectStage,
} from "./types";

type StageSlices = {
  fillGaps: InteractiveExerciseFillGapsStage | null;
  fillCode: InteractiveExerciseFillCodeStage | null;
  matchPairs: InteractiveExerciseMatchPairsStage | null;
  selectCorrect: InteractiveExerciseSelectCorrectStage | null;
  chooseMatching: InteractiveExerciseChooseMatchingStage | null;
};

export function resolveActiveStage(
  currentState: StageState,
  slices: StageSlices,
): InteractiveExerciseActiveStage {
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
