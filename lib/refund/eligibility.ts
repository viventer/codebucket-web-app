import type { CourseDocument } from "@/schemas/courseSchema";

export const REFUND_WINDOW_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getRefundWindowDays(
  presale: CourseDocument["presale"] | undefined,
): number {
  return presale?.refundDays ?? REFUND_WINDOW_DAYS;
}

export function getRefundAnchorDate(
  purchaseDate: Date,
  presale: CourseDocument["presale"] | undefined,
): Date {
  if (presale?.releaseDate) {
    return new Date(presale.releaseDate);
  }
  return purchaseDate;
}

export function getRefundDeadline(
  purchaseDate: Date,
  presale: CourseDocument["presale"] | undefined,
): Date {
  const anchor = getRefundAnchorDate(purchaseDate, presale);
  const days = getRefundWindowDays(presale);
  return new Date(anchor.getTime() + days * MS_PER_DAY);
}

export function isRefundEligible(
  purchaseDate: Date,
  presale: CourseDocument["presale"] | undefined,
  now: Date = new Date(),
): boolean {
  return now.getTime() <= getRefundDeadline(purchaseDate, presale).getTime();
}
