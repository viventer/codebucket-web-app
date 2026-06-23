"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCourseNavigationOptional } from "@/lib/course/navigation-transition-context";
import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
import { NavButton } from "./NavButton";

type GatedBackNextActionsProps = {
  prevHref: string | null;
  nextHref: string | null;
};

export function GatedBackNextActions({
  prevHref,
  nextHref,
}: GatedBackNextActionsProps) {
  const router = useRouter();
  const navigation = useCourseNavigationOptional();
  const { canProceed, handleProceedAttempt } = useExerciseSession();

  const handleBack = () => {
    if (!prevHref) {
      return;
    }

    navigation?.setNavigationIntent("back");
    router.push(prevHref);
  };

  return (
    <div className="flex w-full items-center justify-end gap-2">
      {prevHref && (
        <Button variant="ghost" onClick={handleBack}>
          <ActionBarButtonLabel label="Cofnij" icon={ChevronLeftIcon} />
        </Button>
      )}
      {canProceed ? (
        <NavButton href={nextHref}>
          <ActionBarButtonLabel label="Przejdź dalej" icon={ChevronRightIcon} />
        </NavButton>
      ) : (
        <Button className="opacity-50" onClick={handleProceedAttempt}>
          <ActionBarButtonLabel label="Przejdź dalej" icon={ChevronRightIcon} />
        </Button>
      )}
    </div>
  );
}
