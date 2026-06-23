"use client";

import { MultiStageExerciseBackAction } from "./MultiStageExerciseBackAction";
import { MultiStageExerciseSecondaryActions } from "./MultiStageExerciseSecondaryActions";
import { MultiStageExerciseSubmitAction } from "./MultiStageExerciseSubmitAction";

type MultiStageExerciseActionsProps = {
  nextHref: string | null;
  isNextSectionChange: boolean;
  hasHint?: boolean;
};

export function MultiStageExerciseActions({
  nextHref,
  isNextSectionChange,
  hasHint,
}: MultiStageExerciseActionsProps) {
  return (
    <div className="flex w-full items-center justify-around gap-2 sm:justify-end">
      <MultiStageExerciseSecondaryActions hasHint={hasHint} />
      <div className="flex items-center gap-1">
        <MultiStageExerciseBackAction />
        <MultiStageExerciseSubmitAction
          nextHref={nextHref}
          isNextSectionChange={isNextSectionChange}
        />
      </div>
    </div>
  );
}
