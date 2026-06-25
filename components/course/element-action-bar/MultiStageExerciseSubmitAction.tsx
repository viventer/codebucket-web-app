"use client";

import { ChevronRightIcon, CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useExerciseSession } from "@/lib/exercises/session/ExerciseSessionContext";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
import { NavButton } from "./NavButton";

type MultiStageExerciseSubmitActionProps = {
  nextHref: string | null;
};

export function MultiStageExerciseSubmitAction({
  nextHref,
}: MultiStageExerciseSubmitActionProps) {
  const {
    controller,
    canProceed,
    canProceedStage,
    isLocked,
    handleCheck,
    handleProceedAttempt,
    currentStageActionBarVariant,
    advanceCurrentStage,
  } = useExerciseSession();
  const hasController = controller !== null;
  const isGatedStage = currentStageActionBarVariant === "gated";

  if (canProceed) {
    return (
      <NavButton href={nextHref}>
        <ActionBarButtonLabel label="Przejdź dalej" icon={ChevronRightIcon} />
      </NavButton>
    );
  }

  if (canProceedStage) {
    return (
      <Button onClick={advanceCurrentStage}>
        <ActionBarButtonLabel label="Przejdź dalej" icon={ChevronRightIcon} />
      </Button>
    );
  }

  if (isGatedStage) {
    return (
      <Button className="opacity-50" onClick={handleProceedAttempt}>
        <ActionBarButtonLabel label="Przejdź dalej" icon={ChevronRightIcon} />
      </Button>
    );
  }

  return (
    <Button onClick={handleCheck} disabled={!hasController || isLocked}>
      <ActionBarButtonLabel label="Zatwierdź" icon={CheckIcon} />
    </Button>
  );
}
