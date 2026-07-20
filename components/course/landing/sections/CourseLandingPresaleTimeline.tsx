import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { CoursePresaleInfo } from "@/lib/course/landing-data";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import DesktopTimeline from "./DesktopTimeline";
import MobileTimeline, { type PresaleTimelineStep } from "./MobileTimeline";

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
  const steps: PresaleTimelineStep[] = [
    {
      icon: "rocket.svg",
      title: "Start przedsprzedaży",
      description:
        currentPrice !== undefined
          ? `Kup kurs w niższej cenie ${formatPrice(currentPrice)}.`
          : "Kup kurs w niższej cenie.",
      dateLabel: presale.presaleStartDateLabel,
      highlighted: false,
    },
    {
      icon: "confetti.svg",
      title: "Premiera kursu",
      description:
        standardPrice !== undefined
          ? `Koniec przedsprzedaży. Cena wzrasta do ${formatPrice(standardPrice)}.`
          : "Koniec przedsprzedaży. Cena wzrasta.",
      dateLabel: presale.releaseDateLabel,
      highlighted: true,
    },
    {
      icon: "shield-check.svg",
      title: "Gwarancja satysfakcji",
      description: `${presale.refundDays} dni na zwrot środków, jeśli kurs Ci się nie spodoba.`,
      dateLabel: null,
      highlighted: false,
    },
  ];

  const refundPeriodLabel = `${presale.refundDays} dni od publikacji`;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl text-center font-medium">
          Terminarz przedsprzedaży
        </h2>
        <p className="text-sm text-muted-foreground">
          Kurs jest w trakcie tworzenia. Pełna wersja będzie dostępna{" "}
          {presale.releaseDateLongLabel}.
        </p>
      </div>

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
                <CardHeader className="flex items-center justify-center gap-2 w-full">
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

      <MobileTimeline steps={steps} />
    </section>
  );
}
