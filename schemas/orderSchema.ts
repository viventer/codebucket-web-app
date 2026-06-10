import z from "zod";

export const orderSchema = z.object({
  userId: z.string().min(1, "User id is required"),
  courseIds: z.array(z.string()).min(1, "Course ids are required"),
  totalAmount: z.number().min(0, "Total amount must be greater than 0"),
  status: z.enum(["pending", "completed", "failed"]),
  paymentStatus: z.enum(["pending", "paid", "failed"]),
  createdAt: z.date(),
});

export type Order = z.infer<typeof orderSchema>;
