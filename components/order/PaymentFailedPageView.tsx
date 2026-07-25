import Link from "next/link";

import { OrderedCourseSection } from "@/components/order/OrderedCourseSection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/format-price";
import { TriangleAlertIcon } from "lucide-react";

export type PaymentFailedPageViewProps = {
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  courseImageUrl: string;
  amount: number;
  currency: string;
};

export function PaymentFailedPageView({
  courseId,
  courseTitle,
  courseDescription,
  courseImageUrl,
  amount,
  currency,
}: PaymentFailedPageViewProps) {
  const amountLabel = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: currency || "PLN",
  }).format(amount);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <TriangleAlertIcon
            className="size-7 text-feedback-destructive"
            strokeWidth={3}
          />
          Płatność{" "}
          <span className="text-feedback-destructive">
            nie została zrealizowana
          </span>
        </CardTitle>
        <CardDescription>
          Nie udało się sfinalizować zakupu. Nie pobraliśmy żadnych środków.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <OrderedCourseSection
          courseTitle={courseTitle}
          courseDescription={courseDescription}
          courseImageUrl={courseImageUrl}
          variant="failed"
        />

        <section className="flex flex-col gap-2">
          <p className="text-sm">
            Cena:{" "}
            <span className="font-medium">
              {amount > 0 ? amountLabel : formatPrice(0)}
            </span>
          </p>
          <p className="text-muted-foreground text-sm">
            Masz problem z płatnością? Spróbuj ponownie lub{" "}
            <Link
              href="/help"
              className="text-foreground underline underline-offset-4"
            >
              skontaktuj się z nami
            </Link>
            .
          </p>
        </section>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-0 bg-transparent">
        <Button asChild className="w-full" size="lg">
          <Link href={`/checkout/${courseId}`}>Ponów płatność</Link>
        </Button>
        <Button asChild variant="secondary" className="w-full" size="lg">
          <Link href={`/course/${courseId}`}>Wróć do strony kursu</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
