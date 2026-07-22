import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { getCoursePath } from "@/lib/courses";
import type { CourseCardData } from "@/actions/courses/types";
import { cn } from "@/lib/utils";
import { ClientIcon } from "@/components/ui/client-icon";

const MAX_TOPICS = 6;

function formatPrice(price: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(price);
}

type RecommendedCourseCardProps = {
  course: CourseCardData;
  purchaseHref?: string;
};

export function RecommendedCourseCard({
  course,
  purchaseHref = "#",
}: RecommendedCourseCardProps) {
  const topics = course.whatYouWillLearn.slice(0, MAX_TOPICS);
  const coursePath = getCoursePath(course.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-md text-sm font-bold",
              course.badgeClassName,
            )}
          >
            {course.badge}
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <p className="text-base text-foreground">
          {formatPrice(course.currentPrice)}
        </p>

        <ul className="flex flex-col gap-2.5">
          {topics.map((topic) => (
            <li key={topic} className="flex items-center gap-2 text-sm">
              <Icon src="checkCircle.svg" size={16} className="text-accent" />
              <p>{topic}</p>
            </li>
          ))}
          {course.whatYouWillLearn.length > MAX_TOPICS && (
            <li className="text-sm text-foreground">I wiele więcej…</li>
          )}
        </ul>
      </CardContent>

      <CardFooter className="flex-col gap-2 border-0 bg-transparent">
        <Button asChild className="w-full" size="lg">
          <a href={purchaseHref}>
            <ClientIcon src="shoppingCart.svg" size={32} />
            {course.isPresale ? "Kup w przedsprzedaży" : "Kup kurs"}
          </a>
        </Button>
        <Button asChild variant="outline" className="w-full" size="lg">
          <Link href={coursePath}>Zobacz szczegóły</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
