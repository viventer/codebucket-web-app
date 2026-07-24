import type { ThankYouPaymentViewStatus } from "@/components/order/thank-you-types";

type OrderStatusLabelProps = {
  status: ThankYouPaymentViewStatus;
};

export function OrderStatusLabel({ status }: OrderStatusLabelProps) {
  if (status === "paid") {
    return <span className="text-feedback-success font-medium">opłacone</span>;
  }
  if (status === "pending") {
    return <span className="text-accent font-medium">w trakcie</span>;
  }
  return <span className="text-destructive font-medium">nieudana</span>;
}
