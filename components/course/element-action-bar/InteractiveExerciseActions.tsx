"use client";

import { useExerciseSession } from "@/lib/exercises/session/ExerciseSessionContext";

import { ExerciseSecondaryActions } from "./ExerciseSecondaryActions";
import { InteractiveExerciseSubmitAction } from "./InteractiveExerciseSubmitAction";

type InteractiveExerciseActionsProps = {
  prevHref: string | null;
  nextHref: string | null;
  hasHint?: boolean;
};

export function InteractiveExerciseActions({
  nextHref,
  hasHint,
}: InteractiveExerciseActionsProps) {
  const { currentStageActionBarVariant } = useExerciseSession();
  const isGatedStage = currentStageActionBarVariant === "gated";

  return (
    <div className="flex w-full items-center justify-around gap-2 sm:w-auto sm:justify-end">
      {!isGatedStage && <ExerciseSecondaryActions hasHint={hasHint} />}
      <InteractiveExerciseSubmitAction nextHref={nextHref} />
    </div>
  );
}
