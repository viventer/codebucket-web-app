"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCourseNavigationOptional } from "@/lib/course/navigation-transition-context";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
import { NavButton } from "./NavButton";

type BackNextActionsProps = {
  prevHref: string | null;
  nextHref: string | null;
  isNextSectionChange: boolean;
};

export function BackNextActions({
  prevHref,
  nextHref,
  isNextSectionChange,
}: BackNextActionsProps) {
  const router = useRouter();
  const navigation = useCourseNavigationOptional();

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
      <NavButton href={nextHref} crossesSection={isNextSectionChange}>
        <ActionBarButtonLabel label="Przejdź dalej" icon={ChevronRightIcon} />
      </NavButton>
    </div>
  );
}
