import Image from "next/image";
import Link from "next/link";

import { CourseAccessNotes } from "@/components/order/CourseAccessNotes";
import { OrderStatusLabel } from "@/components/order/OrderStatusLabel";
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
  retryCheckoutHref: string | null;
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
  retryCheckoutHref,
}: ThankYouPageViewProps) {
  const amountLabel = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: currency || "PLN",
  }).format(amount);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Dzięki, że wybrałeś Code<span className="text-accent">Bucket</span>
          </CardTitle>
          <CardDescription>
            Cieszę się, że mogę pomóc Ci tworzyć coraz lepsze strony
            internetowe.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-medium mb-1">Twój kurs</h2>
              <div className="ring-1 ring-accent rounded-lg p-3 bg-accent/10 flex items-center gap-2">
                <Image
                  src={courseImageUrl}
                  alt=""
                  width={48}
                  height={48}
                  className="size-10 shrink-0"
                />
                <div className="flex flex-col">
                  <p className="font-medium">{courseTitle}</p>
                  <p className="text-muted-foreground text-sm">
                    {courseDescription}
                  </p>
                </div>
              </div>
            </div>
            <CourseAccessNotes
              paymentStatus={paymentStatus}
              releaseDateLabel={releaseDateLabel}
            />
          </section>

          <section>
            <h2 className="text-lg font-medium mb-1">Szczegóły zamówienia</h2>
            <p className="text-sm">
              Kwota:{" "}
              <span className="font-medium">
                {amount > 0 ? amountLabel : formatPrice(0)}
              </span>
            </p>
            <p className="text-sm">
              Status: <OrderStatusLabel status={paymentStatus} />
            </p>
          </section>
        </CardContent>

        <CardFooter className="border-0 bg-transparent">
          {paymentStatus === "failed" && retryCheckoutHref ? (
            <Button asChild className="w-full" size="lg">
              <Link href={retryCheckoutHref}>Ponów płatność</Link>
            </Button>
          ) : (
            <Button asChild className="w-full" size="lg">
              <Link href={`/course/${courseId}`}>Przejdź na stronę kursu</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
