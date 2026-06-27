"use client";

import { MultiStageExerciseActions } from "./MultiStageExerciseActions";

type InteractiveExerciseActionsProps = {
  prevHref: string | null;
  nextHref: string | null;
  hasHint?: boolean;
};

export function InteractiveExerciseActions({
  nextHref,
  hasHint,
}: InteractiveExerciseActionsProps) {
  return <MultiStageExerciseActions nextHref={nextHref} hasHint={hasHint} />;
}
