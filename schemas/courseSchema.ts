import { z } from "zod";

import {
  codeExerciseContentSchema,
  codeSnippetSchema,
  interactiveExerciseContentSchema,
} from "./exerciseSchema";

export {
  codeExerciseContentSchema,
  codeSnippetSchema,
  customInteractiveExerciseContentSchema,
  fillCodeContentSchema,
  fillGapsContentSchema,
  fillGapsGroupSegmentSchema,
  fillGapsLineSchema,
  fillCodeStageSchema,
  fillGapsStageSchema,
  matchPairsStageSchema,
  multiStageContentSchema,
  multiStageStagePresentationSchema,
  multiStageStageSchema,
  interactiveExerciseContentSchema,
  interactiveExerciseTypeSchema,
  languageSchema,
  matchPairSchema,
  matchPairsContentSchema,
  selectCorrectAnswerSchema,
  selectCorrectAnswerTypeSchema,
  selectCorrectContentSchema,
  selectCorrectPromptSchema,
  selectCorrectStageSchema,
} from "./exerciseSchema";

export type {
  CodeExerciseContent,
  CodeSnippet,
  FillCodeContent,
  FillGapsContent,
  FillGapsLine,
  FillCodeStage,
  FillGapsStage,
  MatchPairsStage,
  MultiStageContent,
  MultiStageStage,
  MultiStageStagePresentation,
  SelectCorrectAnswer,
  SelectCorrectAnswerType,
  SelectCorrectContent,
  SelectCorrectPrompt,
  SelectCorrectStage,
  InteractiveExerciseContent,
  InteractiveExerciseType,
  Language,
  MatchPairsContent,
} from "./exerciseSchema";

export const courseElementTypeSchema = z.enum([
  "video",
  "codeExercise",
  "interactiveExercise",
  "interactiveDemo",
  "guidedProject",
  "individualProject",
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

export type VideoContent = z.infer<typeof videoContentSchema>;
export type InteractiveDemoContent = z.infer<
  typeof interactiveDemoContentSchema
>;
export type GuidedProjectContent = z.infer<typeof guidedProjectContentSchema>;
export type IndividualProjectContent = z.infer<
  typeof individualProjectContentSchema
>;
export type CourseElement = z.infer<typeof courseElementSchema>;
export type CourseSection = z.infer<typeof courseSectionSchema>;
export type CourseEnding = z.infer<typeof courseEndingSchema>;
export type Course = z.infer<typeof courseSchema>;
