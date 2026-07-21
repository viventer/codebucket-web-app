import { CheckIcon, ListChecksIcon, TagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { StartCourseButton } from "@/components/course/landing/StartCourseButton";
import { PresaleGuaranteeInfo } from "@/components/course/landing/PresaleGuaranteeInfo";
import { FreeBadge } from "@/components/course/FreeBadge";
import { Button } from "@/components/ui/button";
import { ClientIcon } from "@/components/ui/client-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AvailableCourseDisplay } from "@/lib/course/available-courses";
import { formatPrice } from "@/lib/format-price";

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

      <CardContent className="flex flex-col gap-4">
        <section>
          <p className="text-base font-bold flex items-center gap-1.5">
            <TagIcon
              className="size-4 shrink-0 text-feedback-success"
              strokeWidth={3}
            />
            {course.currentPrice !== undefined
              ? formatPrice(course.currentPrice)
              : "Za darmo"}
          </p>

          {course.ctaType === "presale" && course.regularPrice !== undefined ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Cena regularna po premierze: {formatPrice(course.regularPrice)}
              </p>
              <PresaleGuaranteeInfo
                refundDays={course.refundDays ?? 0}
                className="w-full"
              />
            </>
          ) : null}
        </section>

        <hr />
        <ul className="flex flex-col gap-2.5 flex-1 justify-end">
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
            className="w-full"
          />
        ) : (
          <Button
            asChild
            className="w-full gap-2 [&_svg]:pointer-events-auto! [&_svg:not([class*='size-'])]:size-auto"
            size="lg"
          >
            <Link href={course.detailsHref}>
              <ClientIcon src="shopping-cart.svg" size={24} />
              {course.primaryCtaLabel}
            </Link>
          </Button>
        )}
        <Button asChild variant="secondary" className="w-full" size="lg">
          <Link href={course.detailsHref}>Zobacz szczegóły</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
