import { CourseLandingFloatingCta } from "@/components/course/landing/CourseLandingFloatingCta";
import { CourseLandingCurriculum } from "@/components/course/landing/sections/CourseLandingCurriculum";
import { CourseLandingFaq } from "@/components/course/landing/sections/CourseLandingFaq";
import { CourseLandingFinalCta } from "@/components/course/landing/sections/CourseLandingFinalCta";
import { CourseLandingHero } from "@/components/course/landing/sections/CourseLandingHero";
import { CourseLandingMethodology } from "@/components/course/landing/sections/CourseLandingMethodology";
import { CourseLandingObjectives } from "@/components/course/landing/sections/CourseLandingObjectives";
import { CourseLandingPresaleBenefits } from "@/components/course/landing/sections/CourseLandingPresaleBenefits";
import { CourseLandingPresaleTimeline } from "@/components/course/landing/sections/CourseLandingPresaleTimeline";
import { CourseLandingStats } from "@/components/course/landing/sections/CourseLandingStats";
import type { CourseLandingData } from "@/lib/course/landing-data";

const PRESALE_CURRICULUM_NOTE =
  "Program jest nadal rozwijany. Kolejność lekcji oraz podział modułów mogą się zmienić.";

type CourseLandingPageProps = {
  data: CourseLandingData;
};

export function CourseLandingPage({ data }: CourseLandingPageProps) {
  return (
    <>
      <main className="mx-auto flex w-[90vw] max-w-[1280px] flex-1 flex-col gap-24 pt-8 pb-16 sm:pb-32 sm:pt-16">
        <CourseLandingHero
          id={data.id}
          title={data.title}
          description={data.description}
          imageUrl={data.imageUrl}
          startHref={data.startHref}
          startButtonLabel={data.startButtonLabel}
          courseIncludes={data.courseIncludes}
          isFree={data.isFree}
          isPresale={data.isPresale}
          currentPrice={data.currentPrice}
          standardPrice={data.standardPrice}
          presale={data.presale}
        />

        <div className="flex flex-col gap-6">
          <CourseLandingStats
            durationLabel={data.durationLabel}
            levelLabel={data.levelLabel}
            prerequisites={data.prerequisites}
          />

          <CourseLandingObjectives whatYouWillLearn={data.whatYouWillLearn} />
        </div>

        {data.isPresale && data.presale ? (
          <div className="flex flex-col gap-12">
            <CourseLandingPresaleTimeline
              presale={data.presale}
              currentPrice={data.currentPrice}
              standardPrice={data.standardPrice}
            />

            <CourseLandingPresaleBenefits
              presale={data.presale}
              currentPrice={data.currentPrice}
              standardPrice={data.standardPrice}
            />
          </div>
        ) : null}

        <CourseLandingCurriculum
          sections={data.sections}
          note={data.isPresale ? PRESALE_CURRICULUM_NOTE : undefined}
        />

        <CourseLandingMethodology extraItems={data.additionalLearningMethods} />

        {data.isPresale ? <CourseLandingFaq faq={data.faq} /> : null}

        <div data-course-landing-final-cta>
          <CourseLandingFinalCta
            id={data.id}
            ctaDescription={data.ctaDescription}
            startHref={data.startHref}
            finalCtaButtonLabel={data.finalCtaButtonLabel}
            isFree={data.isFree}
            isPresale={data.isPresale}
          />
        </div>
      </main>

      <CourseLandingFloatingCta
        courseId={data.id}
        startHref={data.startHref}
        label={data.finalCtaButtonLabel}
        isFree={data.isFree}
        isPresale={data.isPresale}
        className="sm:hidden"
      />
    </>
  );
}
