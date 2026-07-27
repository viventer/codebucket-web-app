import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseLandingData } from "@/lib/course/landing-data";
import { CourseLandingHeroCta } from "@/components/course/landing/CourseLandingHeroCta";
import { Icon } from "@/components/ui/icon";

function getCourseIncludeIcon(label: string): string {
  const normalized = label.toLowerCase();

  if (normalized.includes("wideo") || normalized.includes("film")) {
    return "clapperboard.svg";
  }

  if (normalized.includes("ćwiczen")) {
    return "gamepad.svg";
  }

  if (normalized.includes("projekt")) {
    return "ruler-cross-pen.svg";
  }

  if (normalized.includes("podsumow") || normalized.includes("ściąg")) {
    return "file-text.svg";
  }

  return "clapperboard.svg";
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

            <CourseLandingHeroCta
              id={id}
              startHref={startHref}
              startButtonLabel={startButtonLabel}
              isFree={isFree}
              isPresale={isPresale}
              currentPrice={currentPrice}
              standardPrice={standardPrice}
              presale={presale}
            />
          </section>
          <Card className="w-full sm:w-fit justify-center ring-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Ten kurs zawiera</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {courseIncludes.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Icon
                      src={getCourseIncludeIcon(item)}
                      size={16}
                      className="shrink-0 text-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
