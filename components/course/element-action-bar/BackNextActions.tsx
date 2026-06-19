import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
import { NavButton } from "./NavButton";

type BackNextActionsProps = {
  prevHref: string | null;
  nextHref: string | null;
};

export function BackNextActions({ prevHref, nextHref }: BackNextActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {prevHref && (
        <Button variant="ghost" asChild>
          <Link href={prevHref}>
            <ActionBarButtonLabel label="Cofnij" icon={ChevronLeftIcon} />
          </Link>
        </Button>
      )}
      <NavButton href={nextHref}>
        <ActionBarButtonLabel label="Przejdź dalej" icon={ChevronRightIcon} />
      </NavButton>
    </div>
  );
}
