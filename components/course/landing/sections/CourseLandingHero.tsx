import Image from "next/image";
import Link from "next/link";
import {
  FileTextIcon,
  FolderKanbanIcon,
  Gamepad2Icon,
  PlayCircleIcon,
  RocketIcon,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseLandingData } from "@/lib/course/landing-data";

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
  | "title"
  | "description"
  | "imageUrl"
  | "startHref"
  | "startButtonLabel"
  | "courseIncludes"
  | "isFree"
>;

export function CourseLandingHero({
  title,
  description,
  imageUrl,
  startHref,
  startButtonLabel,
  courseIncludes,
  isFree,
}: CourseLandingHeroProps) {
  return (
    <div className="flex gap-6">
      <section className="flex-1 bg-transparent ring-0">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <section className="flex flex-col gap-6">
            {isFree ? (
              <div className="w-fit rounded-full bg-foreground/20 px-5 py-1 text-sm">
                Cały kurs <span className="text-feedback-success">za 0 zł</span>
              </div>
            ) : null}

            <div className="flex items-start gap-3">
              <Image
                src={imageUrl}
                alt=""
                width={72}
                height={72}
                className="size-12 shrink-0 sm:size-16"
              />
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {title}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full max-w-md"
              data-course-landing-hero-cta
            >
              <Link href={startHref}>
                <RocketIcon />
                {startButtonLabel}
              </Link>
            </Button>
          </section>
          <Card className="w-full sm:w-fit justify-center bg-primary/20 ring-0">
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
