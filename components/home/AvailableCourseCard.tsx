import Image from "next/image";
import Link from "next/link";

import { CourseLandingUserStateProvider } from "@/components/course/landing/CourseLandingUserStateProvider";
import { CoursePrimaryCtaButton } from "@/components/course/landing/CoursePrimaryCtaButton";
import { AvailableCourseStatus } from "@/components/home/AvailableCourseStatus";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AvailableCourseDisplay } from "@/lib/course/available-courses";

type AvailableCourseCardProps = {
  course: AvailableCourseDisplay;
};

export function AvailableCourseCard({ course }: AvailableCourseCardProps) {
  return (
    <CourseLandingUserStateProvider
      courseId={course.id}
      isPresale={course.isPresale}
      sections={course.sections}
    >
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

        <CardContent className="flex flex-col gap-4">
          <AvailableCourseStatus
            isFree={course.isFree}
            isPresale={course.isPresale}
            currentPrice={course.currentPrice}
            regularPrice={course.regularPrice}
            refundDays={course.refundDays}
          />

          <hr />
          <ul className="flex flex-col gap-2.5 flex-1 justify-end">
            {course.highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-1.5 text-sm">
                <Icon
                  src="check-circle.svg"
                  size={16}
                  className="shrink-0 text-accent"
                />
                <span>{highlight}</span>
              </li>
            ))}
            <li className="text-sm text-muted-foreground">I wiele więcej...</li>
          </ul>
        </CardContent>

        <CardFooter className="mt-auto flex-col gap-2 border-0 bg-transparent pt-0">
          <CoursePrimaryCtaButton
            courseId={course.id}
            startHref={course.startHref}
            label={course.primaryCtaLabel}
            isFree={course.isFree}
            isPresale={course.isPresale}
            sections={course.sections}
            className="w-full"
          />
          <Button asChild variant="secondary" className="w-full" size="lg">
            <Link href={course.detailsHref}>Zobacz szczegóły</Link>
          </Button>
        </CardFooter>
      </Card>
    </CourseLandingUserStateProvider>
  );
}
