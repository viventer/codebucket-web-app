import type { Transaction } from "@paddle/paddle-node-sdk";

import { getCourseDocument } from "@/actions/courses/read-courses";
import type { ThankYouPaymentViewStatus } from "@/components/order/thank-you-types";
import { getSessionUser } from "@/lib/auth/session";
import { getCourseImageUrl } from "@/lib/course/landing-data";
import { paddleAmountToMajor } from "@/lib/paddle/amounts";
import {
  fulfillOrder,
  getOrderPaymentStatus,
} from "@/lib/paddle/fulfill-order";
import { getPaddleServer } from "@/lib/paddle/server";
import type { Order } from "@/schemas/orderSchema";

export type OrderViewData = {
  paymentStatus: ThankYouPaymentViewStatus;
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  courseImageUrl: string;
  amount: number;
  currency: string;
  releaseDateLabel: string | null;
};

const DEFAULT_COURSE_ID = "css-basics";
const DEFAULT_COURSE_TITLE = "Podstawy CSS";
const DEFAULT_COURSE_DESCRIPTION =
  "Naucz się stylować strony internetowe od podstaw.";
const DEFAULT_COURSE_IMAGE = "css-logo.svg";

const FAILED_PAYMENT_ATTEMPT_STATUSES = new Set([
  "error",
  "dropped",
  "canceled",
]);

function mapTransactionToPaymentStatus(
  transaction: Transaction,
): ThankYouPaymentViewStatus {
  if (transaction.status === "completed" || transaction.status === "paid") {
    return "paid";
  }

  const latestAttempt = [...transaction.payments].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )[0];

  if (
    latestAttempt &&
    FAILED_PAYMENT_ATTEMPT_STATUSES.has(latestAttempt.status)
  ) {
    return "failed";
  }

  if (
    transaction.status === "canceled" ||
    transaction.status === "past_due"
  ) {
    return "failed";
  }

  return "pending";
}

function mapStoredOrderStatus(
  paymentStatus: Order["paymentStatus"],
): ThankYouPaymentViewStatus | null {
  if (paymentStatus === "paid") {
    return "paid";
  }
  if (
    paymentStatus === "failed" ||
    paymentStatus === "refunded" ||
    paymentStatus === "cancelled"
  ) {
    return "failed";
  }
  return null;
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

export function getDefaultOrderView(
  paymentStatus: ThankYouPaymentViewStatus = "failed",
): OrderViewData {
  return {
    paymentStatus,
    courseId: DEFAULT_COURSE_ID,
    courseTitle: DEFAULT_COURSE_TITLE,
    courseDescription: DEFAULT_COURSE_DESCRIPTION,
    courseImageUrl: getCourseImageUrl(DEFAULT_COURSE_ID, DEFAULT_COURSE_IMAGE),
    amount: 0,
    currency: "PLN",
    releaseDateLabel: null,
  };
}

export async function loadOrderView(
  transactionId: string,
): Promise<OrderViewData> {
  const sessionUser = await getSessionUser();
  const paddle = getPaddleServer();

  let paymentStatus: ThankYouPaymentViewStatus = "pending";
  let courseId = DEFAULT_COURSE_ID;
  let amount = 0;
  let currency = "PLN";

  try {
    const transaction = await paddle.transactions.get(transactionId, {
      include: ["customer"],
    });

    paymentStatus = mapTransactionToPaymentStatus(transaction);

    if (paymentStatus === "pending") {
      const storedStatus = await getOrderPaymentStatus(transactionId);
      if (storedStatus) {
        const mapped = mapStoredOrderStatus(storedStatus);
        if (mapped) {
          paymentStatus = mapped;
        }
      }
    }

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
    const email = transaction.customer?.email ?? sessionUser?.email ?? "";

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

    const storedStatus = await getOrderPaymentStatus(transactionId);
    if (storedStatus) {
      paymentStatus = mapStoredOrderStatus(storedStatus) ?? "pending";
    } else {
      paymentStatus = "pending";
    }
  }

  const course = await getCourseDocument(courseId);
  const courseTitle = course?.title ?? DEFAULT_COURSE_TITLE;
  const courseDescription =
    course?.description ?? DEFAULT_COURSE_DESCRIPTION;
  const courseImageUrl = getCourseImageUrl(
    courseId,
    course?.image ?? DEFAULT_COURSE_IMAGE,
  );
  const releaseDateLabel = formatReleaseDateLabel(course?.presale?.releaseDate);

  return {
    paymentStatus,
    courseId,
    courseTitle,
    courseDescription,
    courseImageUrl,
    amount: amount > 0 ? amount : (course?.price.currentPrice ?? 0),
    currency,
    releaseDateLabel,
  };
}
