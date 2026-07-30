"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { MouseEvent } from "react";

import { Button } from "@/components/ui/button";

const AccountDialog = dynamic(
  () =>
    import("@/components/account/AccountDialog").then((m) => ({
      default: m.AccountDialog,
    })),
  { ssr: false },
);

const COURSES_SECTION_ID = "wybierz-kurs";

function handleKursyClick(event: MouseEvent<HTMLAnchorElement>) {
  if (window.location.pathname !== "/") return;

  event.preventDefault();
  document
    .getElementById(COURSES_SECTION_ID)
    ?.scrollIntoView({ behavior: "smooth" });

  if (window.location.hash !== `#${COURSES_SECTION_ID}`) {
    window.history.replaceState(null, "", `/#${COURSES_SECTION_ID}`);
  }
}

export function AccountButtons() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/#${COURSES_SECTION_ID}`} onClick={handleKursyClick}>
          Kursy
        </Link>
      </Button>
      <AccountDialog triggerVariant="secondary" />
    </div>
  );
}
