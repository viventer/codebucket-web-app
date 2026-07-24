import z from "zod";

export const orderSchema = z.object({
  userId: z.string().min(1, "User id is required"),
  courseIds: z.array(z.string()).min(1, "Course ids are required"),
  totalAmount: z.number().min(0, "Total amount must be greater than or equal to 0"),
  currency: z.string().min(1, "Currency is required"),
  email: z.string().email("Email is required"),
  paddleTransactionId: z.string().min(1, "Paddle transaction id is required"),
  status: z.enum(["pending", "completed", "failed", "refunded", "cancelled"]),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded", "cancelled"]),
  emailSent: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Order = z.infer<typeof orderSchema>;
