import type { CourseLandingData } from "@/lib/course/landing-data";
import { CtaCard } from "@/components/CtaCard";
import { StartCourseButton } from "@/components/course/landing/StartCourseButton";
import { PresaleCtaButton } from "@/components/course/landing/PresaleCtaButton";

type CourseLandingFinalCtaProps = Pick<
  CourseLandingData,
  | "id"
  | "ctaDescription"
  | "startHref"
  | "finalCtaButtonLabel"
  | "isFree"
  | "isPresale"
>;

export function CourseLandingFinalCta({
  id,
  ctaDescription,
  startHref,
  finalCtaButtonLabel,
  isFree,
  isPresale,
}: CourseLandingFinalCtaProps) {
  return (
    <CtaCard
      title={
        isPresale ? "Dołącz do przedsprzedaży" : "Gotowy rozpocząć naukę?"
      }
      description={ctaDescription}
    >
      {isPresale ? (
        <PresaleCtaButton
          label={finalCtaButtonLabel}
          className="w-full max-w-md"
        />
      ) : startHref ? (
        <StartCourseButton
          courseId={id}
          startHref={startHref}
          label={finalCtaButtonLabel}
          isFree={isFree}
          className="w-full max-w-md"
        />
      ) : null}
    </CtaCard>
  );
}
