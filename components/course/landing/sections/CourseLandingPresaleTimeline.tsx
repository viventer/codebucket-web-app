import { SectionHeading } from "@/components/SectionHeading";
import { PresaleTimelineVertical } from "@/components/course/PresaleTimelineVertical";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { CoursePresaleInfo } from "@/lib/course/landing-data";
import { buildPresaleTimelineSteps } from "@/lib/course/presale-timeline";
import { cn } from "@/lib/utils";
import DesktopTimeline from "./DesktopTimeline";

type CourseLandingPresaleTimelineProps = {
  presale: CoursePresaleInfo;
  currentPrice?: number;
  standardPrice?: number;
};

export function CourseLandingPresaleTimeline({
  presale,
  currentPrice,
  standardPrice,
}: CourseLandingPresaleTimelineProps) {
  const steps = buildPresaleTimelineSteps(presale, currentPrice, standardPrice);
  const refundPeriodLabel = `${presale.refundDays} dni od publikacji`;

  return (
    <section className="flex flex-col gap-6">
      <SectionHeading>
        <SectionHeading.Title>Terminarz przedsprzedaży</SectionHeading.Title>
        <SectionHeading.Description>
          Kurs jest w trakcie tworzenia. Pełna wersja będzie dostępna{" "}
          {presale.releaseDateLongLabel}.
        </SectionHeading.Description>
      </SectionHeading>

      <div className="hidden sm:flex sm:flex-col sm:gap-5">
        <ol className="grid grid-cols-3 gap-6">
          {steps.map((step) => (
            <li key={step.title}>
              <Card
                className={cn(
                  "h-full items-center gap-3 text-center",
                  step.highlighted && "ring-accent bg-accent/5",
                )}
              >
                <CardHeader className="flex w-full items-center justify-center gap-2">
                  <Icon
                    src={step.icon}
                    size={32}
                    className={
                      step.highlighted ? "text-accent" : "text-foreground"
                    }
                  />
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>

        <DesktopTimeline
          startDate={steps[0]?.dateLabel ?? ""}
          releaseDate={steps[1]?.dateLabel ?? ""}
          refundPeriodLabel={refundPeriodLabel}
        />
      </div>

      <PresaleTimelineVertical steps={steps} className="sm:hidden" />
    </section>
  );
}
