import { CourseLandingFloatingCta } from "@/components/course/landing/CourseLandingFloatingCta";
import { CourseLandingUserStateProvider } from "@/components/course/landing/CourseLandingUserStateProvider";
import { SalesCtaGate } from "@/components/course/landing/SalesCtaGate";
import { CourseLandingCurriculum } from "@/components/course/landing/sections/CourseLandingCurriculum";
import { CourseLandingFaq } from "@/components/course/landing/sections/CourseLandingFaq";
import { CourseLandingFinalCta } from "@/components/course/landing/sections/CourseLandingFinalCta";
import { CourseLandingHero } from "@/components/course/landing/sections/CourseLandingHero";
import { CourseLandingMethodology } from "@/components/course/landing/sections/CourseLandingMethodology";
import { CourseLandingObjectives } from "@/components/course/landing/sections/CourseLandingObjectives";
import { CourseLandingPresaleBenefits } from "@/components/course/landing/sections/CourseLandingPresaleBenefits";
import { CourseLandingPresaleTimeline } from "@/components/course/landing/sections/CourseLandingPresaleTimeline";
import { CourseLandingStats } from "@/components/course/landing/sections/CourseLandingStats";
import { MainContainer } from "@/components/MainContainer";
import type { CourseLandingData } from "@/lib/course/landing-data";

const PRESALE_CURRICULUM_NOTE =
  "Program jest nadal rozwijany. Kolejność lekcji oraz podział modułów mogą się zmienić.";

type CourseLandingPageProps = {
  data: CourseLandingData;
};

export function CourseLandingPage({ data }: CourseLandingPageProps) {
  return (
    <CourseLandingUserStateProvider
      courseId={data.id}
      isPresale={data.isPresale}
      sections={data.sections}
    >
      <MainContainer>
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

        <SalesCtaGate>
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
        </SalesCtaGate>
      </MainContainer>

      <SalesCtaGate>
        <CourseLandingFloatingCta
          courseId={data.id}
          startHref={data.startHref}
          label={data.finalCtaButtonLabel}
          isFree={data.isFree}
          isPresale={data.isPresale}
          className="sm:hidden"
        />
      </SalesCtaGate>
    </CourseLandingUserStateProvider>
  );
}
