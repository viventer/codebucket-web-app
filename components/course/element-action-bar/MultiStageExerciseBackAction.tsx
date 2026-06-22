"use client";

import { ChevronLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";

export function MultiStageExerciseBackAction() {
  const { canGoBack, goToPreviousStage } = useExerciseSession();

  return (
    <Button variant="ghost" onClick={goToPreviousStage} disabled={!canGoBack}>
      <ActionBarButtonLabel label="Cofnij" icon={ChevronLeftIcon} />
    </Button>
  );
}
