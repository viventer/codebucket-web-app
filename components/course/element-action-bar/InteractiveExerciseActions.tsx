"use client";

import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";

import { ExerciseActions } from "./ExerciseActions";
import { GatedBackNextActions } from "./GatedBackNextActions";
import { MultiStageExerciseActions } from "./MultiStageExerciseActions";

type InteractiveExerciseActionsProps = {
  prevHref: string | null;
  nextHref: string | null;
  isNextSectionChange: boolean;
  hasHint?: boolean;
};

export function InteractiveExerciseActions({
  prevHref,
  nextHref,
  isNextSectionChange,
  hasHint,
}: InteractiveExerciseActionsProps) {
  const { actionBarMode } = useExerciseSession();

  if (actionBarMode === "multi-stage") {
    return (
      <MultiStageExerciseActions
        nextHref={nextHref}
        isNextSectionChange={isNextSectionChange}
        hasHint={hasHint}
      />
    );
  }

  if (actionBarMode === "back-next-gated") {
    return (
      <GatedBackNextActions
        prevHref={prevHref}
        nextHref={nextHref}
        isNextSectionChange={isNextSectionChange}
      />
    );
  }

  return (
    <ExerciseActions
      nextHref={nextHref}
      isNextSectionChange={isNextSectionChange}
      hasHint={hasHint}
    />
  );
}
