import Image from "next/image";
import {
  FileTextIcon,
  FolderKanbanIcon,
  Gamepad2Icon,
  PlayCircleIcon,
  TagIcon,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FreeBadge } from "@/components/course/FreeBadge";
import type { CourseLandingData } from "@/lib/course/landing-data";
import { StartCourseButton } from "@/components/course/landing/StartCourseButton";
import { PresaleCtaButton } from "@/components/course/landing/PresaleCtaButton";
import { PresaleGuaranteeInfo } from "@/components/course/landing/PresaleGuaranteeInfo";
import { formatPrice } from "@/lib/format-price";

function getCourseIncludeIcon(label: string): LucideIcon {
  const normalized = label.toLowerCase();

  if (normalized.includes("wideo") || normalized.includes("film")) {
    return PlayCircleIcon;
  }

  if (normalized.includes("ćwiczen")) {
    return Gamepad2Icon;
  }

  if (normalized.includes("projekt")) {
    return FolderKanbanIcon;
  }

  if (normalized.includes("podsumow") || normalized.includes("ściąg")) {
    return FileTextIcon;
  }

  return PlayCircleIcon;
}

type CourseLandingHeroProps = Pick<
  CourseLandingData,
  | "id"
  | "title"
  | "description"
  | "imageUrl"
  | "startHref"
  | "startButtonLabel"
  | "courseIncludes"
  | "isFree"
  | "isPresale"
  | "currentPrice"
  | "standardPrice"
  | "presale"
>;

export function CourseLandingHero({
  id,
  title,
  description,
  imageUrl,
  startHref,
  startButtonLabel,
  courseIncludes,
  isFree,
  isPresale,
  currentPrice,
  standardPrice,
  presale,
}: CourseLandingHeroProps) {
  return (
    <div className="flex gap-6">
      <section className="flex-1 bg-transparent ring-0">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <section className="flex flex-col gap-6">
            {isFree ? <FreeBadge /> : null}

            <div className="flex items-start gap-3">
              <Image
                src={imageUrl}
                alt=""
                width={72}
                height={72}
                className="size-12 shrink-0 sm:size-16"
              />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {title}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>

            {isPresale ? (
              <div className="flex flex-col gap-6" data-course-landing-hero-cta>
                <div className="flex flex-col gap-0.5">
                  {currentPrice !== undefined ? (
                    <p className="flex items-center gap-1.5 text-xl font-bold">
                      <TagIcon
                        className="size-4 shrink-0 text-feedback-success"
                        strokeWidth={3}
                      />
                      {formatPrice(currentPrice)}
                    </p>
                  ) : null}
                  {standardPrice !== undefined ? (
                    <p className="text-sm text-muted-foreground">
                      Cena regularna po premierze: {formatPrice(standardPrice)}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <PresaleCtaButton
                    label={startButtonLabel}
                    className="w-full max-w-md"
                  />
                  {presale ? (
                    <PresaleGuaranteeInfo refundDays={presale.refundDays} />
                  ) : null}
                </div>
              </div>
            ) : startHref ? (
              <div data-course-landing-hero-cta>
                <StartCourseButton
                  courseId={id}
                  startHref={startHref}
                  label={startButtonLabel}
                  isFree={isFree}
                  className="w-full max-w-md"
                />
              </div>
            ) : null}
          </section>
          <Card className="w-full sm:w-fit justify-center ring-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Ten kurs zawiera</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {courseIncludes.map((item) => {
                  const Icon = getCourseIncludeIcon(item);

                  return (
                    <li key={item} className="flex items-center gap-2">
                      <Icon className="size-4 shrink-0 text-accent" />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
