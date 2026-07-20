import { Card, CardContent } from "@/components/ui/card";
import type { CourseLandingData } from "@/lib/course/landing-data";
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
    <Card className="ring-accent bg-accent/5">
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-medium">
            {isPresale ? "Dołącz do przedsprzedaży" : "Gotowy rozpocząć naukę?"}
          </h2>
          <p className="text-sm text-muted-foreground">{ctaDescription}</p>
        </div>

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
      </CardContent>
    </Card>
  );
}
