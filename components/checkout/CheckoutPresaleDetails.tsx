import { CheckoutBenefitRow } from "@/components/checkout/CheckoutBenefitRow";
import { PresaleTimelineVertical } from "@/components/course/PresaleTimelineVertical";
import type { CoursePresaleInfo } from "@/lib/course/landing-data";
import {
  buildPresaleBenefits,
  toCheckoutBenefitOrder,
} from "@/lib/course/presale-benefits";
import { buildPresaleTimelineSteps } from "@/lib/course/presale-timeline";

type CheckoutPresaleDetailsProps = {
  presale: CoursePresaleInfo;
  currentPrice?: number;
  standardPrice?: number;
};

export function CheckoutPresaleDetails({
  presale,
  currentPrice,
  standardPrice,
}: CheckoutPresaleDetailsProps) {
  const benefits = toCheckoutBenefitOrder(
    buildPresaleBenefits({
      refundDays: presale.refundDays,
      currentPrice,
      standardPrice,
    }),
  );
  const steps = buildPresaleTimelineSteps(presale, currentPrice, standardPrice);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          Po zakupie kurs zostanie przypisany do Twojego konta. O premierze
          poinformujemy Cię e-mailem.
        </p>
        <p className="text-sm text-muted-foreground">
          Planowana data premiery:{" "}
          <span className="text-foreground">{presale.releaseDateLabel}</span>
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {benefits.map((benefit) => (
          <CheckoutBenefitRow
            key={benefit.shortLabel}
            icon={benefit.icon}
            label={benefit.shortLabel}
            description={benefit.description}
          />
        ))}
      </ul>

      <div className="flex flex-col gap-4">
        <h3 className="font-medium">Terminarz przedsprzedaży</h3>
        <PresaleTimelineVertical steps={steps} />
      </div>
    </div>
  );
}
