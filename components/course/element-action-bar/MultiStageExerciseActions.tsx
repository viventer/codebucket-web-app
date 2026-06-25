"use client";

import { useExerciseSession } from "@/lib/exercises/session/ExerciseSessionContext";

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
  const { currentStageActionBarVariant } = useExerciseSession();
  const isGatedStage = currentStageActionBarVariant === "gated";

  return (
    <div className="flex w-full items-center justify-around gap-2 sm:w-auto sm:justify-end">
      {!isGatedStage && <ExerciseSecondaryActions hasHint={hasHint} />}
      <MultiStageExerciseSubmitAction nextHref={nextHref} />
    </div>
  );
}
