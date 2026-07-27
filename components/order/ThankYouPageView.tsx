import Link from "next/link";

import { CourseAccessNotes } from "@/components/order/CourseAccessNotes";
import { OrderedCourseSection } from "@/components/order/OrderedCourseSection";
import { OrderStatusLabel } from "@/components/order/OrderStatusLabel";
import { RefreshPaymentStatusButton } from "@/components/order/RefreshPaymentStatusButton";
import type { ThankYouPaymentViewStatus } from "@/components/order/thank-you-types";
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

export type ThankYouPageViewProps = {
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  courseImageUrl: string;
  amount: number;
  currency: string;
  paymentStatus: ThankYouPaymentViewStatus;
  releaseDateLabel: string | null;
};

export function ThankYouPageView({
  courseId,
  courseTitle,
  courseDescription,
  courseImageUrl,
  amount,
  currency,
  paymentStatus,
  releaseDateLabel,
}: ThankYouPageViewProps) {
  const amountLabel = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: currency || "PLN",
  }).format(amount);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Dzięki, że wybrałeś Code<span className="text-accent">Bucket</span>
        </CardTitle>
        <CardDescription>
          Cieszę się, że mogę pomóc Ci tworzyć coraz lepsze strony internetowe.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <section className="flex flex-col gap-4">
          <OrderedCourseSection
            courseTitle={courseTitle}
            courseDescription={courseDescription}
            courseImageUrl={courseImageUrl}
          />
          <CourseAccessNotes
            paymentStatus={paymentStatus}
            releaseDateLabel={releaseDateLabel}
          />
        </section>

        <section>
          <h2 className="text-lg font-medium mb-1">Szczegóły płatności</h2>
          <p className="text-sm">
            Kwota:{" "}
            <span className="font-medium">
              {amount > 0 ? amountLabel : formatPrice(0)}
            </span>
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-sm">
              Status: <OrderStatusLabel status={paymentStatus} />
            </p>
            {paymentStatus !== "pending" ? (
              <RefreshPaymentStatusButton />
            ) : null}
          </div>
        </section>
      </CardContent>

      <CardFooter className="border-0 bg-transparent">
        <Button asChild className="w-full" size="lg">
          <Link href={`/course/${courseId}`}>Przejdź na stronę kursu</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
