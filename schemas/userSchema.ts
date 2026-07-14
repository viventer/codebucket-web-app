import z from "zod";

export const courseProgressEntrySchema = z.object({
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
  courseProgress: z.record(z.string(), courseProgressEntrySchema),
  preferences: z.object({
    colorScheme: z.enum(["light", "dark"]).optional(),
  }),
});

export type CourseProgressEntry = z.infer<typeof courseProgressEntrySchema>;
export type User = z.infer<typeof userSchema>;
