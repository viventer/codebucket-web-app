"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  COURSES_SECTION_HREF,
  handleCoursesSectionLinkClick,
} from "@/lib/scroll-to-courses-section";

const AccountDialog = dynamic(
  () =>
    import("@/components/account/AccountDialog").then((m) => ({
      default: m.AccountDialog,
    })),
  { ssr: false },
);

export function AccountButtons() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link
          href={COURSES_SECTION_HREF}
          onClick={handleCoursesSectionLinkClick}
        >
          Kursy
        </Link>
      </Button>
      <AccountDialog triggerVariant="secondary" />
    </div>
  );
}
