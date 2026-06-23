"use client";

import { ElementBackAction } from "./ElementBackAction";
import { ExercisePrimaryAction } from "./ExercisePrimaryAction";
import { ExerciseSecondaryActions } from "./ExerciseSecondaryActions";

type ExerciseActionsProps = {
  prevHref: string | null;
  nextHref: string | null;
  hasHint?: boolean;
};

export function ExerciseActions({
  prevHref,
  nextHref,
  hasHint,
}: ExerciseActionsProps) {
  return (
    <div className="flex w-full items-center justify-around gap-2 sm:w-auto sm:justify-end">
      <ExerciseSecondaryActions hasHint={hasHint} />
      <div className="flex items-center gap-1">
        <ElementBackAction prevHref={prevHref} />
        <ExercisePrimaryAction nextHref={nextHref} />
      </div>
    </div>
  );
}
