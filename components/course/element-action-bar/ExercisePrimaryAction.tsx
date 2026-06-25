"use client";

import { CheckIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useExerciseSession } from "@/lib/exercises/session/ExerciseSessionContext";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
import { NavButton } from "./NavButton";

type ExercisePrimaryActionProps = {
  nextHref: string | null;
};

export function ExercisePrimaryAction({ nextHref }: ExercisePrimaryActionProps) {
  const { controller, canProceed, handleCheck } = useExerciseSession();
  const hasController = controller !== null;

  if (canProceed) {
    return (
      <NavButton href={nextHref}>
        <ActionBarButtonLabel label="Przejdź dalej" icon={ChevronRightIcon} />
      </NavButton>
    );
  }

  return (
    <Button onClick={handleCheck} disabled={!hasController}>
      <ActionBarButtonLabel label="Zrobione" icon={CheckIcon} />
    </Button>
  );
}
