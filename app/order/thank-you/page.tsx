import { getCourseDocument } from "@/actions/courses/read-courses";
import { ThankYouPageView } from "@/components/order/ThankYouPageView";
import type { ThankYouPaymentViewStatus } from "@/components/order/thank-you-types";
import { getSessionUser } from "@/lib/auth/session";
import { paddleAmountToMajor } from "@/lib/paddle/amounts";
import { getCourseImageUrl } from "@/lib/course/landing-data";
import { fulfillOrder } from "@/lib/paddle/fulfill-order";
import { getPaddleServer } from "@/lib/paddle/server";
import type { TransactionStatus } from "@paddle/paddle-node-sdk";

type ThankYouPageProps = {
  searchParams: Promise<{
    transaction_id?: string;
    _ptxn?: string;
  }>;
};

export const metadata = {
  title: "Dziękujemy za zakup – CodeBucket",
};

function mapTransactionStatus(
  status: TransactionStatus,
): ThankYouPaymentViewStatus {
  if (status === "completed" || status === "paid") {
    return "paid";
  }
  if (status === "canceled" || status === "past_due") {
    return "failed";
  }
  return "pending";
}

function formatReleaseDateLabel(isoDate: string | undefined): string | null {
  if (!isoDate) {
    return null;
  }

  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoDate));
}

function readCustomData(
  customData: Record<string, unknown> | null | undefined,
): { userId: string | null; courseId: string | null } {
  if (!customData) {
    return { userId: null, courseId: null };
  }

  const userId =
    typeof customData.userId === "string" ? customData.userId : null;
  const courseId =
    typeof customData.courseId === "string" ? customData.courseId : null;

  return { userId, courseId };
}

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const params = await searchParams;
  const transactionId = params.transaction_id ?? params._ptxn;

  if (!transactionId) {
    return (
      <ThankYouPageView
        courseId="css-basics"
        courseTitle="Podstawy CSS"
        courseDescription="Naucz się stylować strony internetowe od podstaw."
        courseImageUrl={getCourseImageUrl("css-basics", "css-logo.svg")}
        amount={0}
        currency="PLN"
        paymentStatus="failed"
        releaseDateLabel={null}
        retryCheckoutHref="/checkout/css-basics"
      />
    );
  }

  const sessionUser = await getSessionUser();
  const paddle = getPaddleServer();

  let paymentStatus: ThankYouPaymentViewStatus = "pending";
  let courseId = "css-basics";
  let amount = 0;
  let currency = "PLN";

  try {
    const transaction = await paddle.transactions.get(transactionId, {
      include: ["customer"],
    });

    paymentStatus = mapTransactionStatus(transaction.status);
    currency = transaction.currencyCode;
    amount = paddleAmountToMajor(
      transaction.details?.totals?.grandTotal ??
        transaction.details?.totals?.total,
    );

    const custom = readCustomData(
      transaction.customData as Record<string, unknown> | null,
    );
    if (custom.courseId) {
      courseId = custom.courseId;
    }

    const userId = custom.userId ?? sessionUser?.uid ?? null;
    const email =
      transaction.customer?.email ?? sessionUser?.email ?? "";

    if (userId && custom.courseId) {
      if (paymentStatus === "paid") {
        await fulfillOrder({
          paddleTransactionId: transaction.id,
          userId,
          courseIds: [custom.courseId],
          totalAmount: amount,
          currency,
          email,
          paymentStatus: "paid",
          status: "completed",
        });
      } else if (paymentStatus === "failed") {
        await fulfillOrder({
          paddleTransactionId: transaction.id,
          userId,
          courseIds: [custom.courseId],
          totalAmount: amount,
          currency,
          email,
          paymentStatus: "failed",
          status: "failed",
        });
      } else {
        await fulfillOrder({
          paddleTransactionId: transaction.id,
          userId,
          courseIds: [custom.courseId],
          totalAmount: amount,
          currency,
          email,
          paymentStatus: "pending",
          status: "pending",
        });
      }
    }
  } catch (error) {
    console.error("Failed to load Paddle transaction:", error);
    paymentStatus = "pending";
  }

  const course = await getCourseDocument(courseId);
  const courseTitle = course?.title ?? "Podstawy CSS";
  const courseDescription =
    course?.description ??
    "Naucz się stylować strony internetowe od podstaw.";
  const courseImageUrl = getCourseImageUrl(
    courseId,
    course?.image ?? "css-logo.svg",
  );
  const releaseDateLabel = formatReleaseDateLabel(course?.presale?.releaseDate);

  return (
    <ThankYouPageView
      courseId={courseId}
      courseTitle={courseTitle}
      courseDescription={courseDescription}
      courseImageUrl={courseImageUrl}
      amount={amount > 0 ? amount : (course?.price.currentPrice ?? 0)}
      currency={currency}
      paymentStatus={paymentStatus}
      releaseDateLabel={releaseDateLabel}
      retryCheckoutHref={`/checkout/${courseId}`}
    />
  );
}
