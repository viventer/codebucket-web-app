"use client";

import {
  EyeIcon,
  LightbulbIcon,
  RotateCcwIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";

type MultiStageExerciseSecondaryActionsProps = {
  hasHint?: boolean;
};

export function MultiStageExerciseSecondaryActions({
  hasHint,
}: MultiStageExerciseSecondaryActionsProps) {
  const {
    controller,
    isLocked,
    reset,
    tryShowSolution,
    showHintDialog,
  } = useExerciseSession();

  const hasController = controller !== null;

  return (
    <>
      {hasHint && (
        <Button variant="ghost" onClick={showHintDialog} disabled={isLocked}>
          <ActionBarButtonLabel label="Wskazówka" icon={LightbulbIcon} />
        </Button>
      )}
      <Button
        variant="ghost"
        onClick={tryShowSolution}
        disabled={!hasController || isLocked}
      >
        <ActionBarButtonLabel label="Rozwiązanie" icon={EyeIcon} />
      </Button>
      <Button variant="ghost" onClick={reset} disabled={!hasController}>
        <ActionBarButtonLabel label="Reset" icon={RotateCcwIcon} />
      </Button>
    </>
  );
}
