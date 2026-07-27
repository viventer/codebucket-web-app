import Link from "next/link";

import { CheckoutCourseCard } from "@/components/checkout/CheckoutCourseCard";
import { CheckoutPresaleDetails } from "@/components/checkout/CheckoutPresaleDetails";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icon } from "@/components/ui/icon";
import type { CoursePresaleInfo } from "@/lib/course/landing-data";
import { formatPrice } from "@/lib/format-price";

type CheckoutOrderSummaryProps = {
  courseId: string;
  title: string;
  description: string;
  imageUrl: string;
  currentPrice?: number;
  standardPrice?: number;
  presale: CoursePresaleInfo | null;
  isPresale: boolean;
};

export function CheckoutOrderSummary({
  courseId,
  title,
  description,
  imageUrl,
  currentPrice,
  standardPrice,
  presale,
  isPresale,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/course/${courseId}`}
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ← Wróć do strony kursu
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          {isPresale
            ? "Kupujesz kurs w przedsprzedaży"
            : "Podsumowanie zamówienia"}
        </h1>
        <p className="hidden text-sm text-muted-foreground lg:block">
          Sprawdź szczegóły zamówienia i dokonaj płatności.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="hidden font-medium text-lg lg:block">Wybrany kurs</h2>
        <CheckoutCourseCard
          title={title}
          description={description}
          imageUrl={imageUrl}
        />
        {currentPrice !== undefined ? (
          <p className="flex items-center gap-2 text-xl font-bold">
            <Icon
              src="price-tag.svg"
              size={24}
              className="shrink-0 text-feedback-success"
            />
            {formatPrice(currentPrice)}
          </p>
        ) : null}
        {isPresale && presale ? (
          <div className="hidden lg:block">
            <CheckoutPresaleDetails
              presale={presale}
              currentPrice={currentPrice}
              standardPrice={standardPrice}
            />
          </div>
        ) : null}
      </div>

      {isPresale && presale ? (
        <Accordion type="single" collapsible className="lg:hidden">
          <AccordionItem value="presale">
            <AccordionTrigger className="text-base font-medium">
              Szczegóły przedsprzedaży
            </AccordionTrigger>
            <AccordionContent>
              <CheckoutPresaleDetails
                presale={presale}
                currentPrice={currentPrice}
                standardPrice={standardPrice}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : null}
    </div>
  );
}
