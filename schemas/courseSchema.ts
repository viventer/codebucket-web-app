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
]);

export const interactiveExerciseTypeSchema = z.enum([
  "fillGaps",
  "matchPairs",
  "fillCode",
  "selectCorrect",
  "custom",
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

const interactiveExerciseBaseSchema = {
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  command: z.string().min(1, "Command is required"),
  hints: z.array(z.string()).optional(),
};

export const fillGapsLineSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("code"),
    text: z.string(),
    indent: z.number().min(0),
  }),
  z.object({
    kind: z.literal("gap"),
    id: z.string().min(1),
    indent: z.number().min(0),
    answer: z.string().min(1),
  }),
  z.object({
    kind: z.literal("autoClose"),
    id: z.string().min(1),
    indent: z.number().min(0),
    pairedGapId: z.string().min(1),
  }),
]);

export const fillGapsContentSchema = z.object({
  ...interactiveExerciseBaseSchema,
  type: z.literal("fillGaps"),
  language: languageSchema,
  lines: z.array(fillGapsLineSchema).min(1),
  options: z.array(z.string().min(1)).min(1),
});

export const matchPairsContentSchema = z.object({
  ...interactiveExerciseBaseSchema,
  type: z.literal("matchPairs"),
});

export const fillCodeContentSchema = z.object({
  ...interactiveExerciseBaseSchema,
  type: z.literal("fillCode"),
});

export const selectCorrectContentSchema = z.object({
  ...interactiveExerciseBaseSchema,
  type: z.literal("selectCorrect"),
});

export const customInteractiveExerciseContentSchema = z.object({
  ...interactiveExerciseBaseSchema,
  type: z.literal("custom"),
  component: z.string().min(1, "Component is required"),
});

export const interactiveExerciseContentSchema = z.discriminatedUnion("type", [
  fillGapsContentSchema,
  matchPairsContentSchema,
  fillCodeContentSchema,
  selectCorrectContentSchema,
  customInteractiveExerciseContentSchema,
]);

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
  materials: z.array(z.string()).optional(),
  finalCode: z.array(codeSnippetSchema),
});

export const individualProjectContentSchema = z.object({
  videoUrl: z.string().min(1, "Project video url is required"),
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  sampleSolution: z.array(codeSnippetSchema),
  materials: z.array(z.string()).optional(),
});

const elementBase = {
  id: z.string().min(1, "Element id is required"),
  order: z.number().min(1, "Order must be greater than 0"),
};

export const courseElementSchema = z.discriminatedUnion("type", [
  z.object({
    ...elementBase,
    type: z.literal("video"),
    content: videoContentSchema,
  }),
  z.object({
    ...elementBase,
    type: z.literal("codeExercise"),
    content: codeExerciseContentSchema,
  }),
  z.object({
    ...elementBase,
    type: z.literal("interactiveExercise"),
    content: interactiveExerciseContentSchema,
  }),
  z.object({
    ...elementBase,
    type: z.literal("interactiveDemo"),
    content: interactiveDemoContentSchema,
  }),
  z.object({
    ...elementBase,
    type: z.literal("quiz"),
    content: quizContentSchema,
  }),
  z.object({
    ...elementBase,
    type: z.literal("guidedProject"),
    content: guidedProjectContentSchema,
  }),
  z.object({
    ...elementBase,
    type: z.literal("individualProject"),
    content: individualProjectContentSchema,
  }),
]);

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
export type InteractiveExerciseType = z.infer<
  typeof interactiveExerciseTypeSchema
>;
export type FillGapsLine = z.infer<typeof fillGapsLineSchema>;
export type FillGapsContent = z.infer<typeof fillGapsContentSchema>;
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
