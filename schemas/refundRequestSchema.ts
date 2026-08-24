import { z } from "zod";

export const REFUND_REASONS = [
  "Nie spełnił moich oczekiwań",
  "Zakup przez pomyłkę",
  "Problem techniczny",
  "Zawiera błąd",
  "Inny",
  "Nie chcę podawać",
] as const;

export const refundReasonSchema = z.enum(REFUND_REASONS);

export const refundRequestInputSchema = z.object({
  courseId: z.string().min(1, "Course id is required"),
  paddleTransactionId: z.string().min(1, "Paddle transaction id is required"),
  reason: refundReasonSchema.optional(),
});

export const refundRequestDocumentSchema = z.object({
  userId: z.string().min(1, "User id is required"),
  email: z.email("Email is required"),
  courseId: z.string().min(1, "Course id is required"),
  courseTitle: z.string().min(1, "Course title is required"),
  paddleTransactionId: z.string().min(1, "Paddle transaction id is required"),
  reason: refundReasonSchema.nullable(),
  status: z.enum(["pending", "approved", "rejected"]),
  createdAt: z.date(),
});

export type RefundReason = z.infer<typeof refundReasonSchema>;
export type RefundRequestInput = z.infer<typeof refundRequestInputSchema>;
export type RefundRequestDocument = z.infer<typeof refundRequestDocumentSchema>;
