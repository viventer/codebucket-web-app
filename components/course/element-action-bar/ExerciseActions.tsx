"use client";

import { Button } from "@/components/ui/button";
import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";

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
    <>
      {hasHint && (
        <Button variant="ghost" onClick={showHintDialog} disabled={isLocked}>
          Wskazówka
        </Button>
      )}
      <Button
        variant="ghost"
        onClick={tryShowSolution}
        disabled={!hasController || isLocked}
      >
        Rozwiązanie
      </Button>
      <Button variant="ghost" onClick={reset} disabled={!hasController}>
        Reset
      </Button>
      {canProceed ? (
        <NavButton href={nextHref}>Przejdź dalej</NavButton>
      ) : (
        <Button onClick={handleCheck} disabled={!hasController}>
          Zrobione
        </Button>
      )}
    </>
  );
}
