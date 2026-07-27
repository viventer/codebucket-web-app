import { redirect } from "next/navigation";

import { ThankYouPageView } from "@/components/order/ThankYouPageView";
import { loadOrderView } from "@/lib/paddle/load-order-view";

type ThankYouPageProps = {
  searchParams: Promise<{
    transaction_id?: string;
    _ptxn?: string;
  }>;
};

export const metadata = {
  title: "Dziękujemy za zakup – CodeBucket",
};

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const params = await searchParams;
  const transactionId = params.transaction_id ?? params._ptxn;

  if (!transactionId) {
    redirect("/order/payment-failed");
  }

  const orderView = await loadOrderView(transactionId);

  if (orderView.paymentStatus === "failed") {
    redirect(
      `/order/payment-failed?transaction_id=${encodeURIComponent(transactionId)}`,
    );
  }

  return (
    <ThankYouPageView
      courseId={orderView.courseId}
      courseTitle={orderView.courseTitle}
      courseDescription={orderView.courseDescription}
      courseImageUrl={orderView.courseImageUrl}
      amount={orderView.amount}
      currency={orderView.currency}
      paymentStatus={orderView.paymentStatus}
      releaseDateLabel={orderView.releaseDateLabel}
    />
  );
}
