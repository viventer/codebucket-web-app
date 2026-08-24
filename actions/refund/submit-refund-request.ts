"use server";

import { FieldValue } from "firebase-admin/firestore";

import { firestoreTimestampToDate } from "@/actions/courses/timestamps";
import { getCourseDocument } from "@/actions/courses/read-courses";
import { RefundRequestConfirmationEmail } from "@/emails/refund-request-confirmation";
import { RefundRequestStaffEmail } from "@/emails/refund-request-staff";
import { adminDB } from "@/firebase/admin-init";
import { getSessionUser } from "@/lib/auth/session";
import { sendEmail } from "@/lib/email/send-email";
import { isRefundEligible } from "@/lib/refund/eligibility";
import { refundRequestInputSchema } from "@/schemas/refundRequestSchema";

type SubmitRefundRequestResult =
  | { success: true }
  | { success: false; error: string };

const STAFF_REFUND_EMAIL = "zwroty@codebucket.pl";

export async function submitRefundRequest(
  input: unknown,
): Promise<SubmitRefundRequestResult> {
  const parsed = refundRequestInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Nieprawidłowe dane wniosku." };
  }

  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return {
      success: false,
      error: "Musisz być zalogowany, aby złożyć wniosek o zwrot.",
    };
  }

  const { courseId, paddleTransactionId, reason } = parsed.data;

  try {
    const orderDoc = await adminDB
      .collection("orders")
      .doc(paddleTransactionId)
      .get();

    if (!orderDoc.exists) {
      return { success: false, error: "Nie znaleziono zamówienia." };
    }

    const order = orderDoc.data();
    if (
      !order ||
      order.userId !== sessionUser.uid ||
      order.paymentStatus !== "paid"
    ) {
      return {
        success: false,
        error: "To zamówienie nie należy do Twojego konta.",
      };
    }

    const courseIds: string[] = Array.isArray(order.courseIds)
      ? order.courseIds
      : [];
    if (!courseIds.includes(courseId)) {
      return {
        success: false,
        error: "Ten kurs nie znajduje się w wybranym zamówieniu.",
      };
    }

    const course = await getCourseDocument(courseId);
    if (!order.createdAt) {
      return { success: false, error: "Nie znaleziono daty zakupu." };
    }
    const purchaseDate = firestoreTimestampToDate(order.createdAt);
    if (!isRefundEligible(purchaseDate, course?.presale)) {
      return {
        success: false,
        error: "Okno zwrotu dla tego kursu już minęło.",
      };
    }

    const existingRequests = await adminDB
      .collection("refundRequests")
      .where("userId", "==", sessionUser.uid)
      .get();
    const alreadyPending = existingRequests.docs.some((doc) => {
      const data = doc.data();
      return data.courseId === courseId && data.status === "pending";
    });
    if (alreadyPending) {
      return {
        success: false,
        error: "Wniosek o zwrot dla tego kursu został już złożony.",
      };
    }

    const courseTitle = course?.title ?? courseId;
    const reasonValue = reason ?? null;

    await adminDB.collection("refundRequests").add({
      userId: sessionUser.uid,
      email: sessionUser.email,
      courseId,
      courseTitle,
      paddleTransactionId,
      reason: reasonValue,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });

    const [staffResult, userResult] = await Promise.all([
      sendEmail({
        to: STAFF_REFUND_EMAIL,
        subject: `Prośba o zwrot: ${courseTitle}`,
        react: RefundRequestStaffEmail({
          userEmail: sessionUser.email,
          userId: sessionUser.uid,
          courseTitle,
          courseId,
          paddleTransactionId,
          reason: reasonValue,
        }),
      }),
      sendEmail({
        to: sessionUser.email,
        subject: `Przyjęliśmy Twoją prośbę o zwrot: ${courseTitle}`,
        react: RefundRequestConfirmationEmail({ courseTitle }),
      }),
    ]);

    if (!staffResult.success) {
      console.error("Refund staff email failed:", staffResult.error);
    }
    if (!userResult.success) {
      console.error("Refund user email failed:", userResult.error);
    }

    return { success: true };
  } catch (error) {
    console.error("submitRefundRequest failed:", error);
    return {
      success: false,
      error: "Nie udało się wysłać wniosku o zwrot. Spróbuj ponownie.",
    };
  }
}
