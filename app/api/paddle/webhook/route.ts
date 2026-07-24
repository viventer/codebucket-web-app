import { EventName } from "@paddle/paddle-node-sdk";
import type { TransactionNotification } from "@paddle/paddle-node-sdk";

import { adminDB } from "@/firebase/admin-init";
import { paddleAmountToMajor } from "@/lib/paddle/amounts";
import { getPaddleWebhookSecret } from "@/lib/paddle/config";
import {
  fulfillOrder,
  markOrderEmailSent,
} from "@/lib/paddle/fulfill-order";
import { sendOrderConfirmationEmail } from "@/lib/paddle/send-order-confirmation";
import { getPaddleServer } from "@/lib/paddle/server";

export const runtime = "nodejs";

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

async function resolveUserEmail(userId: string): Promise<string> {
  const userDoc = await adminDB.collection("users").doc(userId).get();
  const email = userDoc.data()?.email;
  return typeof email === "string" ? email : "";
}

async function handlePaidTransaction(
  transaction: TransactionNotification,
): Promise<void> {
  const custom = readCustomData(
    transaction.customData as Record<string, unknown> | null,
  );

  if (!custom.userId || !custom.courseId) {
    console.error(
      "Paddle webhook: missing userId/courseId in customData",
      transaction.id,
    );
    return;
  }

  const amount = paddleAmountToMajor(
    transaction.details?.totals?.grandTotal ??
      transaction.details?.totals?.total,
  );
  const currency = transaction.currencyCode;
  const email = await resolveUserEmail(custom.userId);

  const result = await fulfillOrder({
    paddleTransactionId: transaction.id,
    userId: custom.userId,
    courseIds: [custom.courseId],
    totalAmount: amount,
    currency,
    email,
    paymentStatus: "paid",
    status: "completed",
  });

  if (result.emailAlreadySent) {
    return;
  }

  const emailResult = await sendOrderConfirmationEmail({
    courseId: custom.courseId,
    amount,
    currency,
  });

  if (emailResult.success) {
    await markOrderEmailSent(transaction.id);
  } else {
    console.error(
      "Failed to send order confirmation email:",
      emailResult.error,
    );
  }
}

async function handleFailedTransaction(
  transaction: TransactionNotification,
): Promise<void> {
  const custom = readCustomData(
    transaction.customData as Record<string, unknown> | null,
  );

  if (!custom.userId || !custom.courseId) {
    return;
  }

  const amount = paddleAmountToMajor(
    transaction.details?.totals?.grandTotal ??
      transaction.details?.totals?.total,
  );
  const email = await resolveUserEmail(custom.userId);

  await fulfillOrder({
    paddleTransactionId: transaction.id,
    userId: custom.userId,
    courseIds: [custom.courseId],
    totalAmount: amount,
    currency: transaction.currencyCode,
    email,
    paymentStatus: "failed",
    status: "failed",
  });
}

async function handlePendingTransaction(
  transaction: TransactionNotification,
): Promise<void> {
  const custom = readCustomData(
    transaction.customData as Record<string, unknown> | null,
  );

  if (!custom.userId || !custom.courseId) {
    return;
  }

  const amount = paddleAmountToMajor(
    transaction.details?.totals?.grandTotal ??
      transaction.details?.totals?.total,
  );
  const email = await resolveUserEmail(custom.userId);

  await fulfillOrder({
    paddleTransactionId: transaction.id,
    userId: custom.userId,
    courseIds: [custom.courseId],
    totalAmount: amount,
    currency: transaction.currencyCode,
    email,
    paymentStatus: "pending",
    status: "pending",
  });
}

export async function POST(request: Request) {
  const signature = request.headers.get("paddle-signature") ?? "";
  const rawBody = await request.text();

  if (!signature || !rawBody) {
    return new Response("Missing signature or body", { status: 400 });
  }

  try {
    const paddle = getPaddleServer();
    const eventData = await paddle.webhooks.unmarshal(
      rawBody,
      getPaddleWebhookSecret(),
      signature,
    );

    switch (eventData.eventType) {
      case EventName.TransactionCompleted:
      case EventName.TransactionPaid: {
        await handlePaidTransaction(
          eventData.data as TransactionNotification,
        );
        break;
      }
      case EventName.TransactionPaymentFailed:
      case EventName.TransactionCanceled: {
        await handleFailedTransaction(
          eventData.data as TransactionNotification,
        );
        break;
      }
      case EventName.TransactionUpdated:
      case EventName.TransactionReady:
      case EventName.TransactionBilled: {
        const transaction = eventData.data as TransactionNotification;
        if (
          transaction.status === "completed" ||
          transaction.status === "paid"
        ) {
          await handlePaidTransaction(transaction);
        } else if (
          transaction.status === "canceled" ||
          transaction.status === "past_due"
        ) {
          await handleFailedTransaction(transaction);
        } else {
          await handlePendingTransaction(transaction);
        }
        break;
      }
      default:
        break;
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Paddle webhook error:", error);
    return new Response("Invalid webhook", { status: 400 });
  }
}
