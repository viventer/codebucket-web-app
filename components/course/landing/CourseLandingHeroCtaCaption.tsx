"use client";

import { CalendarDays, CirclePlay, RotateCcw } from "lucide-react";

import { PresaleGuaranteeInfo } from "@/components/course/landing/PresaleGuaranteeInfo";
import type { CoursePresaleInfo } from "@/lib/course/landing-data";
import type { CourseLandingUserState } from "@/lib/course/landing-user-state";

type CourseLandingHeroCtaCaptionProps = {
  state: CourseLandingUserState;
  isFree: boolean;
  isPresale: boolean;
  presale: CoursePresaleInfo | null;
};

export function CourseLandingHeroCtaCaption({
  state,
  isFree,
  isPresale,
  presale,
}: CourseLandingHeroCtaCaptionProps) {
  if (state.status === "owned-presale") {
    return (
      <p className="flex items-center gap-1.5 text-sm">
        <CalendarDays className="size-4 shrink-0" aria-hidden />
        Planowana premiera kursu:{" "}
        {presale?.releaseDateLabel ?? "wkrótce"}
      </p>
    );
  }

  if (state.status === "in-progress") {
    return (
      <p className="flex items-center gap-1.5 text-sm">
        <CirclePlay className="size-4 shrink-0" aria-hidden />
        Kontynuuj od ostatnio ukończonej lekcji
      </p>
    );
  }

  if (state.status === "completed") {
    return (
      <p className="flex items-center gap-1.5 text-sm">
        <RotateCcw className="size-4 shrink-0" aria-hidden />
        Powtarzaj materiał w dowolnym momencie.
      </p>
    );
  }

  // status === "none"
  if (isPresale && presale) {
    return <PresaleGuaranteeInfo refundDays={presale.refundDays} />;
  }

  if (isFree) {
    return (
      <p className="flex items-center gap-1.5 text-sm">
        <CirclePlay className="size-4 shrink-0" aria-hidden />
        Od razu przejdź do nauki.
      </p>
    );
  }

  return null;
}
