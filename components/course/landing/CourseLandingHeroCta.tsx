"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { CourseLandingHeroCtaCaption } from "@/components/course/landing/CourseLandingHeroCtaCaption";
import { CourseLandingHeroStatusHeader } from "@/components/course/landing/CourseLandingHeroStatusHeader";
import { useCourseLandingUserState } from "@/components/course/landing/CourseLandingUserStateProvider";
import { PresaleCtaButton } from "@/components/course/landing/PresaleCtaButton";
import { StartCourseButton } from "@/components/course/landing/StartCourseButton";
import { CourseLandingHeroCtaSkeleton } from "@/components/skeletons/CourseLandingHeroCtaSkeleton";
import { Button } from "@/components/ui/button";
import { ClientIcon } from "@/components/ui/client-icon";
import type { CourseLandingData } from "@/lib/course/landing-data";

type CourseLandingHeroCtaProps = Pick<
  CourseLandingData,
  | "id"
  | "startHref"
  | "startButtonLabel"
  | "isFree"
  | "isPresale"
  | "currentPrice"
  | "standardPrice"
  | "presale"
>;

export function CourseLandingHeroCta({
  id,
  startHref,
  startButtonLabel,
  isFree,
  isPresale,
  currentPrice,
  standardPrice,
  presale,
}: CourseLandingHeroCtaProps) {
  const { loading, state } = useCourseLandingUserState();

  if (loading) {
    return <CourseLandingHeroCtaSkeleton />;
  }

  let button: ReactNode = null;

  if (state.status === "owned-presale") {
    button = (
      <Button
        size="lg"
        disabled
        className="w-full max-w-md gap-2 [&_svg]:pointer-events-auto! [&_svg:not([class*='size-'])]:size-auto"
      >
        <ClientIcon src="rocket.svg" size={24} />
        {state.buttonLabel}
      </Button>
    );
  } else if (state.status === "in-progress" || state.status === "completed") {
    button = (
      <Button
        asChild
        size="lg"
        className="w-full max-w-md gap-2 [&_svg]:pointer-events-auto! [&_svg:not([class*='size-'])]:size-auto"
      >
        <Link href={state.resumeHref}>
          <ClientIcon src="rocket.svg" size={24} />
          {state.buttonLabel}
        </Link>
      </Button>
    );
  } else if (isPresale) {
    button = (
      <PresaleCtaButton
        courseId={id}
        label={startButtonLabel}
        className="w-full max-w-md"
      />
    );
  } else if (startHref) {
    button = (
      <StartCourseButton
        courseId={id}
        startHref={startHref}
        label={startButtonLabel}
        isFree={isFree}
        className="w-full max-w-md"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6" data-course-landing-hero-cta>
      <CourseLandingHeroStatusHeader
        state={state}
        isFree={isFree}
        isPresale={isPresale}
        currentPrice={currentPrice}
        standardPrice={standardPrice}
      />

      <div className="flex flex-col gap-2">
        {button}
        <CourseLandingHeroCtaCaption
          state={state}
          isFree={isFree}
          isPresale={isPresale}
          presale={presale}
        />
      </div>
    </div>
  );
}
