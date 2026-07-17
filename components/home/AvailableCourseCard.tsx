import { CheckCircle2Icon, CheckCircleIcon, CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { StartCourseButton } from "@/components/course/landing/StartCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AvailableCourseDisplay } from "@/lib/available-courses-content";

type AvailableCourseCardProps = {
  course: AvailableCourseDisplay;
};

export function AvailableCourseCard({ course }: AvailableCourseCardProps) {
  return (
    <Card>
      <CardHeader className="grid-cols-1 gap-2">
        <div className="flex items-center gap-2">
          <Image
            src={course.iconUrl}
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0"
          />
          <CardTitle className="text-lg font-medium tracking-tight sm:text-xl">
            {course.title}
          </CardTitle>
        </div>
        <CardDescription className="text-sm leading-tight sm:text-base">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col gap-2.5">
          {course.highlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-1.5 text-sm">
              <CheckIcon
                className="size-4 shrink-0 text-accent"
                strokeWidth={3}
              />
              <span>{highlight}</span>
            </li>
          ))}
          <li className="text-sm text-muted-foreground">I wiele więcej...</li>
        </ul>
      </CardContent>

      <CardFooter className="mt-auto flex-col gap-2 border-0 bg-transparent pt-0">
        {course.ctaType === "free-start" && course.startHref ? (
          <StartCourseButton
            courseId={course.id}
            startHref={course.startHref}
            label={course.primaryCtaLabel}
            isFree={course.isFree}
            showIcon={false}
            className="w-full"
          />
        ) : (
          <Button asChild className="w-full" size="lg">
            <Link href={course.detailsHref}>{course.primaryCtaLabel}</Link>
          </Button>
        )}
        <Button asChild variant="secondary" className="w-full" size="lg">
          <Link href={course.detailsHref}>Zobacz szczegóły</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
