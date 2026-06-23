"use client";

import { MultiStageExerciseBackAction } from "./MultiStageExerciseBackAction";
import { ExerciseSecondaryActions } from "./ExerciseSecondaryActions";
import { MultiStageExerciseSubmitAction } from "./MultiStageExerciseSubmitAction";

type MultiStageExerciseActionsProps = {
  nextHref: string | null;
  hasHint?: boolean;
};

export function MultiStageExerciseActions({
  nextHref,
  hasHint,
}: MultiStageExerciseActionsProps) {
  return (
    <div className="flex w-full items-center justify-around gap-2 sm:w-auto sm:justify-end">
      <ExerciseSecondaryActions hasHint={hasHint} />
      <div className="flex items-center gap-1">
        <MultiStageExerciseBackAction />
        <MultiStageExerciseSubmitAction nextHref={nextHref} />
      </div>
    </div>
  );
}
