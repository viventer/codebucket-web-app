"use client";

import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";

import { ExerciseActions } from "./ExerciseActions";
import { GatedBackNextActions } from "./GatedBackNextActions";
import { MultiStageExerciseActions } from "./MultiStageExerciseActions";

type InteractiveExerciseActionsProps = {
  prevHref: string | null;
  nextHref: string | null;
  hasHint?: boolean;
};

export function InteractiveExerciseActions({
  prevHref,
  nextHref,
  hasHint,
}: InteractiveExerciseActionsProps) {
  const { actionBarMode } = useExerciseSession();

  if (actionBarMode === "multi-stage") {
    return (
      <MultiStageExerciseActions nextHref={nextHref} hasHint={hasHint} />
    );
  }

  if (actionBarMode === "back-next-gated") {
    return (
      <GatedBackNextActions prevHref={prevHref} nextHref={nextHref} />
    );
  }

  return (
    <ExerciseActions nextHref={nextHref} hasHint={hasHint} />
  );
}
