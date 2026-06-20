"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
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
  const { canProceed, handleProceedAttempt } = useExerciseSession();

  return (
    <div className="flex w-full items-center justify-end gap-2">
      {prevHref && (
        <Button variant="ghost" asChild>
          <Link href={prevHref}>
            <ActionBarButtonLabel label="Cofnij" icon={ChevronLeftIcon} />
          </Link>
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
