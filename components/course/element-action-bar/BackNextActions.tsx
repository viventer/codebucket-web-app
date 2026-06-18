import Link from "next/link";

import { Button } from "@/components/ui/button";

import { NavButton } from "./NavButton";

type BackNextActionsProps = {
  prevHref: string | null;
  nextHref: string | null;
};

export function BackNextActions({ prevHref, nextHref }: BackNextActionsProps) {
  return (
    <>
      {prevHref && (
        <Button variant="ghost" asChild>
          <Link href={prevHref}>Cofnij</Link>
        </Button>
      )}
      <NavButton href={nextHref}>Przejdź dalej</NavButton>
    </>
  );
}
