import type { User } from "@/schemas/userSchema";

// Temporary static stand-in until auth + Firestore progress are wired up.
export const mockUser: User = {
  email: "siemasiema@gmail.com",
  createdAt: new Date(),
  updatedAt: new Date(),
  role: "user",
  unlockedCourses: ["html-fundamentals"],
  completedCourses: [],
  currentCourse: "html-fundamentals",
  courseProgress: [
    {
      courseId: "html-fundamentals",
      sectionsCompleted: ["introduction"],
      elementsCompleted: [
        "introduction-video",
        "tools",
        "what-is-html",
        "first-website",
        "page-structure",
        "html-structure",
      ],
    },
  ],
  preferences: {
    colorScheme: "dark",
  },
};
