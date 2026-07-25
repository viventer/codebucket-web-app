"use server";

import { getCourseDocument } from "@/actions/courses/read-courses";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";
import { getCourseImageUrl } from "@/lib/course/landing-data";
import { sendEmail } from "@/lib/email/send-email";

type SendOrderConfirmationEmailInput = {
  courseId: string;
  amount: number;
  currency: string;
};

export async function sendOrderConfirmationEmail(
  input: SendOrderConfirmationEmailInput,
): Promise<{ success: boolean; error?: string }> {
  const course = await getCourseDocument(input.courseId);
  const courseTitle = course?.title ?? "Podstawy CSS";
  const courseDescription =
    course?.description ?? "Naucz się stylować strony internetowe od podstaw.";
  const courseImageUrl = getCourseImageUrl(
    input.courseId,
    course?.image ?? "css-logo.svg",
  );

  const releaseDateLabel = course?.presale?.releaseDate
    ? new Intl.DateTimeFormat("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(course.presale.releaseDate))
    : null;

  const amountLabel = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: input.currency || "PLN",
  }).format(
    input.amount > 0 ? input.amount : (course?.price.currentPrice ?? 0),
  );

  // Recipient is currently hardcoded inside sendEmail (kontakt.codebucket@gmail.com).
  const result = await sendEmail({
    to: "kontakt.codebucket@gmail.com",
    subject: `Potwierdzenie zakupu: ${courseTitle}`,
    react: OrderConfirmationEmail({
      courseId: input.courseId,
      courseTitle,
      courseDescription,
      courseImageUrl,
      amountLabel,
      releaseDateLabel,
    }),
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true };
}
