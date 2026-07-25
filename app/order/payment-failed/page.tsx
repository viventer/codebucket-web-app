import { redirect } from "next/navigation";

import { PaymentFailedPageView } from "@/components/order/PaymentFailedPageView";
import {
  getDefaultOrderView,
  loadOrderView,
} from "@/lib/paddle/load-order-view";

type PaymentFailedPageProps = {
  searchParams: Promise<{
    transaction_id?: string;
    _ptxn?: string;
  }>;
};

export const metadata = {
  title: "Płatność nie została zrealizowana – CodeBucket",
};

export default async function PaymentFailedPage({
  searchParams,
}: PaymentFailedPageProps) {
  const params = await searchParams;
  const transactionId = params.transaction_id ?? params._ptxn;

  if (!transactionId) {
    const defaults = getDefaultOrderView("failed");
    return (
      <PaymentFailedPageView
        courseId={defaults.courseId}
        courseTitle={defaults.courseTitle}
        courseDescription={defaults.courseDescription}
        courseImageUrl={defaults.courseImageUrl}
        amount={defaults.amount}
        currency={defaults.currency}
      />
    );
  }

  const orderView = await loadOrderView(transactionId);

  if (orderView.paymentStatus !== "failed") {
    redirect(
      `/order/thank-you?transaction_id=${encodeURIComponent(transactionId)}`,
    );
  }

  return (
    <PaymentFailedPageView
      courseId={orderView.courseId}
      courseTitle={orderView.courseTitle}
      courseDescription={orderView.courseDescription}
      courseImageUrl={orderView.courseImageUrl}
      amount={orderView.amount}
      currency={orderView.currency}
    />
  );
}
