"use client";

import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  LightbulbIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useExerciseSession } from "@/lib/exercises/session/ExerciseSessionContext";
import { useCourseNavigationOptional } from "@/lib/course/navigation-transition-context";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
import { DownloadMaterialsButton } from "./DownloadMaterialsButton";
import { NavButton } from "./NavButton";

type LocalCodeExerciseActionsProps = {
  prevHref: string | null;
  nextHref: string | null;
  hasMaterials: boolean;
  hasHint?: boolean;
};

export function LocalCodeExerciseActions({
  prevHref,
  nextHref,
  hasMaterials,
  hasHint,
}: LocalCodeExerciseActionsProps) {
  const router = useRouter();
  const navigation = useCourseNavigationOptional();
  const { localPhase, markLocalExerciseCompleted, tryShowSolution, showHintDialog } =
    useExerciseSession();

  const isCompleted = localPhase === "completed";

  const handleBack = () => {
    if (!prevHref) {
      return;
    }

    navigation?.setNavigationIntent("back");
    router.push(prevHref);
  };

  return (
    <div className="flex w-full items-center justify-around gap-2 sm:w-auto sm:justify-end">
      {hasMaterials && <DownloadMaterialsButton />}
      {hasHint && (
        <Button variant="ghost" onClick={showHintDialog}>
          <ActionBarButtonLabel label="Ściąga" icon={LightbulbIcon} />
        </Button>
      )}
      {!isCompleted && (
        <Button variant="ghost" onClick={tryShowSolution}>
          <ActionBarButtonLabel label="Rozwiązanie" icon={EyeIcon} />
        </Button>
      )}
      {prevHref && (
        <Button variant="ghost" onClick={handleBack}>
          <ActionBarButtonLabel label="Cofnij" icon={ChevronLeftIcon} />
        </Button>
      )}
      {isCompleted ? (
        <NavButton href={nextHref}>
          <ActionBarButtonLabel label="Przejdź dalej" icon={ChevronRightIcon} />
        </NavButton>
      ) : (
        <Button onClick={markLocalExerciseCompleted}>
          <ActionBarButtonLabel label="Zrobione" icon={CheckCircleIcon} />
        </Button>
      )}
    </div>
  );
}
