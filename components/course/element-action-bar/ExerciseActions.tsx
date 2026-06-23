"use client";

import {
  CheckIcon,
  ChevronRightIcon,
  EyeIcon,
  LightbulbIcon,
  RotateCcwIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
import { NavButton } from "./NavButton";

type ExerciseActionsProps = {
  nextHref: string | null;
  hasHint?: boolean;
};

export function ExerciseActions({ nextHref, hasHint }: ExerciseActionsProps) {
  const {
    controller,
    canProceed,
    isLocked,
    reset,
    handleCheck,
    tryShowSolution,
    showHintDialog,
  } = useExerciseSession();

  const hasController = controller !== null;

  return (
    <div className="flex w-full items-center justify-around gap-2 sm:justify-end">
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
      {canProceed ? (
        <NavButton href={nextHref}>
          <ActionBarButtonLabel label="Przejdź dalej" icon={ChevronRightIcon} />
        </NavButton>
      ) : (
        <Button onClick={handleCheck} disabled={!hasController}>
          <ActionBarButtonLabel label="Zrobione" icon={CheckIcon} />
        </Button>
      )}
    </div>
  );
}
