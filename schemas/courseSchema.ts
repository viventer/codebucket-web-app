import { z } from "zod";

import {
  customExerciseContentSchema,
  interactiveExerciseContentSchema,
  localCodeExerciseContentSchema,
  platformCodeExerciseContentSchema,
  codeSnippetSchema,
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
  description: z.string().optional(),
  hasMaterials: z.boolean(),
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

/** Presale metadata. Its presence marks a course as a presale course. */
export const coursePresaleSchema = z.object({
  presaleStartDate: z.string().min(1, "Presale start date is required"),
  releaseDate: z.string().min(1, "Release date is required"),
  refundDays: z.number().min(0, "Refund days must be positive"),
});

export const courseFaqItemSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export const courseLearningMethodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const coursePrerequisiteSchema = z.object({
  label: z.string().min(1, "Prerequisite label is required"),
  courseId: z.string().min(1, "Prerequisite course id is required").optional(),
});

/** Accepts plain labels or objects with an optional linked course id. */
export const coursePrerequisiteInputSchema = z.union([
  z.string().min(1),
  coursePrerequisiteSchema,
]);

export const courseSchema = z.object({
  id: z.string().min(1, "Course id is required"),
  title: z.string().min(1, "Title is required"),
  price: coursePriceSchema,
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image is required"),
  duration: z.number().gt(0, "Duration must be greater than 0"),
  level: z.string().min(1).optional(),
  prerequisites: z.array(coursePrerequisiteInputSchema).optional(),
  courseIncludes: z
    .array(z.string().min(1))
    .min(1, "Course includes is required"),
  CTADescription: z.string().min(1, "CTA Description is required"),
  whatYouWillLearn: z
    .array(z.string())
    .min(1, "What you will learn is required"),
  highlights: z.array(z.string().min(1)).optional(),
  additionalLearningMethods: z.array(courseLearningMethodSchema).optional(),
  faq: z.array(courseFaqItemSchema).optional(),
  presale: coursePresaleSchema.optional(),
  badge: z.string().min(1).optional(),
  badgeClassName: z.string().min(1).optional(),
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
export type CoursePresale = z.infer<typeof coursePresaleSchema>;
export type CourseFaqItem = z.infer<typeof courseFaqItemSchema>;
export type CourseLearningMethod = z.infer<typeof courseLearningMethodSchema>;
export type CoursePrerequisite = z.infer<typeof coursePrerequisiteSchema>;
export type CoursePrerequisiteInput = z.infer<
  typeof coursePrerequisiteInputSchema
>;
/** @deprecated Use CourseEndingContent */
export type CourseEnding = CourseEndingContent;
export type Course = z.infer<typeof courseSchema>;

export const courseOutlineElementSchema = z.object({
  id: z.string().min(1),
  type: courseElementTypeSchema,
  displayTitle: z.string().min(1),
  order: z.number().min(1),
});

export const courseOutlineSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  order: z.number().min(0),
  elements: z.array(courseOutlineElementSchema),
});

export const courseOutlineSchema = z.object({
  startSectionId: z.string().min(1).optional(),
  startElementId: z.string().min(1).optional(),
  sections: z.array(courseOutlineSectionSchema),
});

export const courseSectionDocumentSchema = courseSectionSchema.omit({
  elements: true,
});

export const courseElementDocumentSchema = courseElementSchema.and(
  z.object({
    displayTitle: z.string().min(1),
  }),
);

export const courseCardFieldsSchema = z.object({
  badge: z.string().min(1),
  badgeClassName: z.string().min(1),
  isPresale: z.boolean(),
});

export const courseDocumentSchema = courseSchema
  .omit({ sections: true })
  .extend({
    outline: courseOutlineSchema,
    ...courseCardFieldsSchema.shape,
  })
  .partial({
    badge: true,
    badgeClassName: true,
    isPresale: true,
  });

/** JSON source file — dates as ISO strings, includes nested sections. */
export const courseJsonSchema = courseSchema.extend({
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

export type CourseOutlineElement = z.infer<typeof courseOutlineElementSchema>;
export type CourseOutlineSection = z.infer<typeof courseOutlineSectionSchema>;
export type CourseOutline = z.infer<typeof courseOutlineSchema>;
export type CourseSectionDocument = z.infer<typeof courseSectionDocumentSchema>;
export type CourseElementDocument = z.infer<typeof courseElementDocumentSchema>;
export type CourseDocument = z.infer<typeof courseDocumentSchema>;
export type CourseJson = z.infer<typeof courseJsonSchema>;
