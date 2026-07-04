import { CourseLandingCurriculum } from "@/components/course/landing/sections/CourseLandingCurriculum";
import { CourseLandingFinalCta } from "@/components/course/landing/sections/CourseLandingFinalCta";
import { CourseLandingHero } from "@/components/course/landing/sections/CourseLandingHero";
import { CourseLandingMethodology } from "@/components/course/landing/sections/CourseLandingMethodology";
import { CourseLandingObjectives } from "@/components/course/landing/sections/CourseLandingObjectives";
import { CourseLandingStats } from "@/components/course/landing/sections/CourseLandingStats";
import type { CourseLandingData } from "@/lib/course/landing-data";

type CourseLandingPageProps = {
  data: CourseLandingData;
};

export function CourseLandingPage({ data }: CourseLandingPageProps) {
  return (
    <main className="mx-auto flex w-[90vw] max-w-[1280px] flex-1 flex-col gap-16 py-8 sm:py-16">
      <CourseLandingHero
        title={data.title}
        description={data.description}
        imageUrl={data.imageUrl}
        startHref={data.startHref}
        startButtonLabel={data.startButtonLabel}
        courseIncludes={data.courseIncludes}
        isFree={data.isFree}
      />

      <CourseLandingStats
        durationLabel={data.durationLabel}
        levelLabel={data.levelLabel}
        prerequisitesLabel={data.prerequisitesLabel}
      />

      <CourseLandingObjectives whatYouWillLearn={data.whatYouWillLearn} />

      <CourseLandingCurriculum sections={data.sections} />

      <CourseLandingMethodology />

      <CourseLandingFinalCta
        ctaDescription={data.ctaDescription}
        startHref={data.startHref}
        finalCtaButtonLabel={data.finalCtaButtonLabel}
      />
    </main>
  );
}
