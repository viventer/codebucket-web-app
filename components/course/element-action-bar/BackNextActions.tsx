"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCourseNavigationOptional } from "@/lib/course/navigation-transition-context";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
import { NavButton } from "./NavButton";

type BackNextActionsProps = {
  prevHref: string | null;
  nextHref: string | null;
};

export function BackNextActions({ prevHref, nextHref }: BackNextActionsProps) {
  const navigation = useCourseNavigationOptional();

  return (
    <div className="flex w-full items-center justify-end gap-2">
      {prevHref && (
        <Button variant="ghost" asChild>
          <Link
            href={prevHref}
            onClick={() => navigation?.setNavigationIntent("back")}
          >
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
