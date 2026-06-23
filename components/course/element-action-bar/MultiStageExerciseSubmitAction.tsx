"use client";

import { CheckIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
import { NavButton } from "./NavButton";

type MultiStageExerciseSubmitActionProps = {
  nextHref: string | null;
  isNextSectionChange: boolean;
};

export function MultiStageExerciseSubmitAction({
  nextHref,
  isNextSectionChange,
}: MultiStageExerciseSubmitActionProps) {
  const { controller, canProceed, isLocked, handleCheck } = useExerciseSession();
  const hasController = controller !== null;

  if (canProceed) {
    return (
      <NavButton href={nextHref} crossesSection={isNextSectionChange}>
        <ActionBarButtonLabel label="Przejdź dalej" icon={ChevronRightIcon} />
      </NavButton>
    );
  }

  return (
    <Button onClick={handleCheck} disabled={!hasController || isLocked}>
      <ActionBarButtonLabel label="Zatwierdź" icon={CheckIcon} />
    </Button>
  );
}
