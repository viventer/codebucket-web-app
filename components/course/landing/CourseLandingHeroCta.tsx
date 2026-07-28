"use client";

import { CourseLandingHeroCtaCaption } from "@/components/course/landing/CourseLandingHeroCtaCaption";
import { CourseLandingHeroStatusHeader } from "@/components/course/landing/CourseLandingHeroStatusHeader";
import { CoursePrimaryCtaButton } from "@/components/course/landing/CoursePrimaryCtaButton";
import { useCourseLandingUserState } from "@/components/course/landing/CourseLandingUserStateProvider";
import { CourseLandingHeroCtaSkeleton } from "@/components/skeletons/CourseLandingHeroCtaSkeleton";
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
        <CoursePrimaryCtaButton
          courseId={id}
          startHref={startHref}
          label={startButtonLabel}
          isFree={isFree}
          isPresale={isPresale}
          className="w-full max-w-md"
        />
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
