import z from "zod";

export const courseProgressSchema = z.object({
  courseId: z.string().min(1, "Course id is required"),
  sectionsCompleted: z.array(z.string()),
  elementsCompleted: z.array(z.string()),
});

export const userSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z.enum(["admin", "user"]),
  unlockedCourses: z.array(z.string()),
  completedCourses: z.array(z.string()),
  currentCourse: z.string().optional(),
  courseProgress: z.array(courseProgressSchema),
  preferences: z.object({
    colorScheme: z.enum(["light", "dark"]).optional(),
  }),
});

export type User = z.infer<typeof userSchema>;
