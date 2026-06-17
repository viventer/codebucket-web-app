import { z } from "zod";

export const languageSchema = z.enum(["javascript", "html", "css"]);

export const questionAnswerTypeSchema = z.enum(["code", "image", "text"]);
export const questionContentTypeSchema = z.enum([
  "code",
  "image",
  "video",
  "textOnly",
]);
export const courseElementTypeSchema = z.enum([
  "video",
  "codeExercise",
  "interactiveExercise",
  "interactiveDemo",
  "quiz",
  "guidedProject",
  "individualProject",
  "finalProject",
]);

export const videoContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  duration: z.number().min(0, "Duration must be greater than 0"),
  whatYouWillLearn: z.array(z.string()).optional(),
  videoUrl: z.string().min(1, "Video URL is required"),
});

export const codeSnippetSchema = z.object({
  language: languageSchema,
  code: z.string().min(1, "Code is required"),
});

export const interactiveDemoContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  component: z.string().min(1, "Component is required"),
});

export const interactiveExerciseContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  command: z.string().min(1, "Command is required"),
  component: z.string().min(1, "Component is required"),
});

export const codeExerciseContentSchema = z.object({
  command: z.string().min(1, "Command is required"),
  languages: z.array(languageSchema),
  starterCode: z.array(codeSnippetSchema),
  solutionCode: z.array(codeSnippetSchema),
  hints: z.array(z.string()).min(1, "Hints are required"),
});

export const questionAnswerSchema = z.object({
  id: z
    .number()
    .min(1, "Answer id must be between 1 and 4")
    .max(4, "Answer id must be between 1 and 4"),
  type: questionAnswerTypeSchema,
  content: z.string().or(codeSnippetSchema),
  explanation: z.string().optional(),
});

export const questionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  contentType: questionContentTypeSchema,
  content: z.string().optional(),
  order: z.number().min(0, "Order must be greater than 0"),
  correctAnswerId: z
    .number()
    .min(1, "Correct answer id must be between 1 and 4")
    .max(4, "Correct answer id must be between 1 and 4"),
  answers: z
    .array(questionAnswerSchema)
    .length(4, "The question must contain four answers"),
});

export const quizContentSchema = z.object({
  questions: z
    .array(questionSchema)
    .min(1, "Quiz must contain at least one question"),
});

export const guidedProjectContentSchema = z.object({
  videoUrl: z.string().min(1, "Project video url is required"),
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  starterCode: z.array(codeSnippetSchema),
  finalCode: z.array(codeSnippetSchema),
});

export const individualProjectContentSchema = z.object({
  videoUrl: z.string().min(1, "Project video url is required"),
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  sampleSolution: z.array(codeSnippetSchema),
});

export const courseElementSchema = z.object({
  id: z.string().min(1, "Element id is required"),
  type: courseElementTypeSchema,
  content: z.union([
    videoContentSchema,
    codeExerciseContentSchema,
    interactiveDemoContentSchema,
    interactiveExerciseContentSchema,
    quizContentSchema,
    guidedProjectContentSchema,
    individualProjectContentSchema,
  ]),
  order: z.number().min(1, "Order must be greater than 0"),
});

export const courseSectionSchema = z.object({
  id: z.string().min(1, "Section id is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  whatYouWillLearn: z.array(z.string()).optional(),
  order: z.number().min(0, "Order must be positive"),
  elements: z.array(courseElementSchema),
  cheatsheets: z.array(z.string()).optional(),
});

export const courseEndingSchema = z.object({
  congrats: z.object({
    heading: z.string(),
    subheading: z.string(),
  }),
  obtainedSkills: z.array(z.string()).min(1, "Obtained skills is required"),
  nextSteps: z.object({
    heading: z.string(),
    subheading: z.string(),
    recommendedCourseIds: z.array(z.string()),
  }),
});

export const coursePriceSchema = z.object({
  isFree: z.boolean(),
  standardPrice: z.number().min(0, "Price must be positive").optional(),
  currentPrice: z.number().min(0, "Price must be positive").optional(),
  thirtyDayLowestPrice: z.number().min(0, "Price must be positive").optional(),
});

export const courseSchema = z.object({
  id: z.string().min(1, "Course id is required"),
  title: z.string().min(1, "Title is required"),
  price: coursePriceSchema,
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image is required"),
  duration: z.number().gt(0, "Duration must be greater than 0"),
  prerequisites: z.array(z.string()).optional(),
  CTADescription: z.string().min(1, "CTA Description is required"),
  whatYouWillLearn: z
    .array(z.string())
    .min(1, "What you will learn is required"),
  sections: z.array(courseSectionSchema),
  ending: courseEndingSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Language = z.infer<typeof languageSchema>;
export type QuestionAnswerType = z.infer<typeof questionAnswerTypeSchema>;
export type QuestionContentType = z.infer<typeof questionContentTypeSchema>;
export type VideoContent = z.infer<typeof videoContentSchema>;
export type CodeSnippet = z.infer<typeof codeSnippetSchema>;
export type CodeExerciseContent = z.infer<typeof codeExerciseContentSchema>;
export type InteractiveDemoContent = z.infer<
  typeof interactiveDemoContentSchema
>;
export type InteractiveExerciseContent = z.infer<
  typeof interactiveExerciseContentSchema
>;
export type Question = z.infer<typeof questionSchema>;
export type QuizContent = z.infer<typeof quizContentSchema>;
export type GuidedProjectContent = z.infer<typeof guidedProjectContentSchema>;
export type IndividualProjectContent = z.infer<
  typeof individualProjectContentSchema
>;
export type CourseElement = z.infer<typeof courseElementSchema>;
export type CourseSection = z.infer<typeof courseSectionSchema>;
export type CourseEnding = z.infer<typeof courseEndingSchema>;
export type Course = z.infer<typeof courseSchema>;
