"use server";

import { FieldValue } from "firebase-admin/firestore";

import { adminDB } from "@/firebase/admin-init";
import type { Order } from "@/schemas/orderSchema";

export type FulfillOrderInput = {
  paddleTransactionId: string;
  userId: string;
  courseIds: string[];
  totalAmount: number;
  currency: string;
  email: string;
  paymentStatus: Order["paymentStatus"];
  status: Order["status"];
};

export type FulfillOrderResult = {
  orderId: string;
  newlyCompleted: boolean;
  emailAlreadySent: boolean;
};

function mapStatusFromPayment(
  paymentStatus: Order["paymentStatus"],
): Order["status"] {
  switch (paymentStatus) {
    case "paid":
      return "completed";
    case "failed":
      return "failed";
    case "refunded":
      return "refunded";
    case "cancelled":
      return "cancelled";
    default:
      return "pending";
  }
}

export async function fulfillOrder(
  input: FulfillOrderInput,
): Promise<FulfillOrderResult> {
  const orderRef = adminDB.collection("orders").doc(input.paddleTransactionId);
  const status = input.status ?? mapStatusFromPayment(input.paymentStatus);

  const result = await adminDB.runTransaction(async (tx) => {
    const existing = await tx.get(orderRef);
    const existingData = existing.exists ? existing.data() : null;
    const wasCompleted = existingData?.paymentStatus === "paid";
    const emailAlreadySent = Boolean(existingData?.emailSent);

    const now = FieldValue.serverTimestamp();

    if (!existing.exists) {
      tx.set(orderRef, {
        userId: input.userId,
        courseIds: input.courseIds,
        totalAmount: input.totalAmount,
        currency: input.currency,
        email: input.email,
        paddleTransactionId: input.paddleTransactionId,
        status,
        paymentStatus: input.paymentStatus,
        emailSent: false,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      tx.update(orderRef, {
        userId: input.userId,
        courseIds: input.courseIds,
        totalAmount: input.totalAmount,
        currency: input.currency,
        email: input.email,
        status,
        paymentStatus: input.paymentStatus,
        updatedAt: now,
      });
    }

    if (input.paymentStatus === "paid" && input.courseIds.length > 0) {
      const userRef = adminDB.collection("users").doc(input.userId);
      tx.update(userRef, {
        unlockedCourses: FieldValue.arrayUnion(...input.courseIds),
        updatedAt: now,
      });
    }

    return {
      orderId: orderRef.id,
      newlyCompleted: input.paymentStatus === "paid" && !wasCompleted,
      emailAlreadySent,
    };
  });

  return result;
}

export async function markOrderEmailSent(
  paddleTransactionId: string,
): Promise<void> {
  await adminDB.collection("orders").doc(paddleTransactionId).update({
    emailSent: true,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function getOrderPaymentStatus(
  paddleTransactionId: string,
): Promise<Order["paymentStatus"] | null> {
  const orderDoc = await adminDB
    .collection("orders")
    .doc(paddleTransactionId)
    .get();

  if (!orderDoc.exists) {
    return null;
  }

  const paymentStatus = orderDoc.data()?.paymentStatus;
  if (
    paymentStatus === "pending" ||
    paymentStatus === "paid" ||
    paymentStatus === "failed" ||
    paymentStatus === "refunded" ||
    paymentStatus === "cancelled"
  ) {
    return paymentStatus;
  }

  return null;
}
