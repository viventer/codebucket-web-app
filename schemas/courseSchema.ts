import { z } from "zod";

import {
  customExerciseContentSchema,
  interactiveExerciseContentSchema,
  localCodeExerciseContentSchema,
  platformCodeExerciseContentSchema,
  codeSnippetSchema,
} from "./exerciseSchema";

export {
  codeSnippetSchema,
  customExerciseContentSchema,
  fillGapsGroupSegmentSchema,
  fillGapsLineSchema,
  fillCodeStageSchema,
  fillGapsStageSchema,
  matchPairsStageSchema,
  exerciseStagePresentationSchema,
  exerciseStageSchema,
  interactiveExerciseContentSchema,
  languageSchema,
  localCodeExerciseContentSchema,
  matchPairSchema,
  platformCodeExerciseContentSchema,
  selectCorrectAnswerSchema,
  selectCorrectAnswerTypeSchema,
  selectCorrectPromptSchema,
  selectCorrectStageSchema,
  chooseMatchingItemSchema,
  chooseMatchingStageSchema,
} from "./exerciseSchema";

export type {
  CodeSnippet,
  CustomExerciseContent,
  FillGapsLine,
  FillCodeStage,
  FillGapsStage,
  MatchPairsStage,
  ExerciseStage,
  ExerciseStagePresentation,
  SelectCorrectAnswer,
  SelectCorrectAnswerType,
  SelectCorrectPrompt,
  SelectCorrectStage,
  ChooseMatchingItem,
  ChooseMatchingStage,
  InteractiveExerciseContent,
  Language,
  LocalCodeExerciseContent,
  PlatformCodeExerciseContent,
} from "./exerciseSchema";

export const courseElementTypeSchema = z.enum([
  "video",
  "platformCodeExercise",
  "localCodeExercise",
  "interactiveExercise",
  "customExercise",
  "interactiveDemo",
  "guidedProject",
  "individualProject",
  "cheatsheet",
  "courseEnding",
]);

export const videoContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  duration: z.number().min(0, "Duration must be greater than 0"),
  whatYouWillLearn: z.array(z.string()).optional(),
  videoUrl: z.string().min(1, "Video URL is required"),
});

export const interactiveDemoContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  component: z.string().min(1, "Component is required"),
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

export const cheatsheetContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const courseEndingContentSchema = z.object({
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
    type: z.literal("platformCodeExercise"),
    content: platformCodeExerciseContentSchema,
  }),
  z.object({
    ...elementBase,
    type: z.literal("localCodeExercise"),
    content: localCodeExerciseContentSchema,
  }),
  z.object({
    ...elementBase,
    type: z.literal("interactiveExercise"),
    content: interactiveExerciseContentSchema,
  }),
  z.object({
    ...elementBase,
    type: z.literal("customExercise"),
    content: customExerciseContentSchema,
  }),
  z.object({
    ...elementBase,
    type: z.literal("interactiveDemo"),
    content: interactiveDemoContentSchema,
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
  z.object({
    ...elementBase,
    type: z.literal("cheatsheet"),
    content: cheatsheetContentSchema,
  }),
  z.object({
    ...elementBase,
    type: z.literal("courseEnding"),
    content: courseEndingContentSchema,
  }),
]);

export const courseSectionSchema = z.object({
  id: z.string().min(1, "Section id is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  whatYouWillLearn: z.array(z.string()).optional(),
  order: z.number().min(0, "Order must be positive"),
  elements: z.array(courseElementSchema),
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
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type VideoContent = z.infer<typeof videoContentSchema>;
export type InteractiveDemoContent = z.infer<
  typeof interactiveDemoContentSchema
>;
export type GuidedProjectContent = z.infer<typeof guidedProjectContentSchema>;
export type IndividualProjectContent = z.infer<
  typeof individualProjectContentSchema
>;
export type CheatsheetContent = z.infer<typeof cheatsheetContentSchema>;
export type CourseEndingContent = z.infer<typeof courseEndingContentSchema>;
export type CourseElement = z.infer<typeof courseElementSchema>;
export type CourseSection = z.infer<typeof courseSectionSchema>;
/** @deprecated Use CourseEndingContent */
export type CourseEnding = CourseEndingContent;
export type Course = z.infer<typeof courseSchema>;
