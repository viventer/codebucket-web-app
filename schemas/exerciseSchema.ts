import { z } from "zod";

export const languageSchema = z.enum(["javascript", "html", "css"]);

export const codeSnippetSchema = z.object({
  language: languageSchema,
  code: z.string().min(1, "Code is required"),
});

const exerciseBaseSchema = {
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  command: z.string().min(1, "Command is required"),
  hints: z.array(z.string()).optional(),
};

export const fillGapsGroupSegmentSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("gap"),
    id: z.string().min(1),
    answer: z.string().min(1),
  }),
  z.object({
    kind: z.literal("text"),
    value: z.string(),
  }),
  z.object({
    kind: z.literal("autoClose"),
    id: z.string().min(1),
    pairedGapId: z.string().min(1),
  }),
]);

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
  z.object({
    kind: z.literal("group"),
    indent: z.number().min(0),
    segments: z.array(fillGapsGroupSegmentSchema).min(1),
  }),
]);

export const exerciseStagePresentationSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("image"),
    imageSrc: z.string().min(1),
  }),
  z.object({
    kind: z.literal("preview"),
    previewHtml: z.string().min(1),
  }),
  z.object({
    kind: z.literal("code"),
  }),
]);

export const selectCorrectAnswerTypeSchema = z.enum(["text", "code", "image"]);

export const selectCorrectAnswerSchema = z.object({
  id: z
    .number()
    .min(1, "Answer id must be between 1 and 4")
    .max(4, "Answer id must be between 1 and 4"),
  type: selectCorrectAnswerTypeSchema.default("text"),
  content: z.string().min(1, "Answer content is required"),
  explanation: z.string().optional(),
});

export const selectCorrectPromptSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("image"),
    imageSrc: z.string().min(1),
  }),
  z.object({
    kind: z.literal("code"),
    language: languageSchema,
    code: z.string().min(1),
  }),
  z.object({
    kind: z.literal("preview"),
    previewHtml: z.string().min(1),
  }),
]);

export const selectCorrectFieldsSchema = {
  question: z.string().min(1, "Question is required"),
  prompt: selectCorrectPromptSchema.optional(),
  answers: z
    .array(selectCorrectAnswerSchema)
    .min(3, "At least three answers are required")
    .max(4, "At most four answers are allowed"),
  correctAnswerId: z
    .number()
    .min(1, "Correct answer id must be between 1 and 4")
    .max(4, "Correct answer id must be between 1 and 4"),
};

export const selectCorrectStageSchema = z.object({
  type: z.literal("selectCorrect"),
  command: z.string().min(1).optional(),
  ...selectCorrectFieldsSchema,
});

export const fillGapsStageSchema = z.object({
  type: z.literal("fillGaps"),
  command: z.string().min(1).optional(),
  language: languageSchema,
  lines: z.array(fillGapsLineSchema).min(1),
  options: z.array(z.string().min(1)).min(1),
  presentation: exerciseStagePresentationSchema.optional(),
  typography: z.enum(["default", "large"]).optional(),
});

export const matchPairSchema = z.object({
  left: z.string().min(1),
  right: z.string().min(1),
});

export const matchPairsStageSchema = z.object({
  type: z.literal("matchPairs"),
  command: z.string().min(1).optional(),
  pairs: z.array(matchPairSchema).min(2),
});

export const fillCodeStageSchema = z.object({
  type: z.literal("fillCode"),
  command: z.string().min(1).optional(),
  language: languageSchema,
  lines: z.array(fillGapsLineSchema).min(1),
  presentation: exerciseStagePresentationSchema.optional(),
  typography: z.enum(["default", "large"]).optional(),
});

export const chooseMatchingItemSchema = z.object({
  id: z.number().min(1),
  content: z.string().min(1),
});

export const chooseMatchingStageSchema = z
  .object({
    type: z.literal("chooseMatching"),
    command: z.string().min(1).optional(),
    items: z.array(chooseMatchingItemSchema).min(2),
    correctItemIds: z.array(z.number().min(1)).min(1),
  })
  .superRefine((data, ctx) => {
    const itemIds = new Set(data.items.map((item) => item.id));
    for (const correctId of data.correctItemIds) {
      if (!itemIds.has(correctId)) {
        ctx.addIssue({
          code: "custom",
          message: `correctItemIds contains unknown id: ${correctId}`,
          path: ["correctItemIds"],
        });
      }
    }
  });

export const exerciseStageSchema = z.discriminatedUnion("type", [
  selectCorrectStageSchema,
  chooseMatchingStageSchema,
  fillGapsStageSchema,
  matchPairsStageSchema,
  fillCodeStageSchema,
]);

export const interactiveExerciseContentSchema = z.object({
  ...exerciseBaseSchema,
  stages: z.array(exerciseStageSchema).min(1),
});

export const customExerciseContentSchema = z.object({
  ...exerciseBaseSchema,
  component: z.string().min(1, "Component is required"),
});

export const platformCodeExerciseContentSchema = z.object({
  command: z.string().min(1, "Command is required"),
  languages: z.array(languageSchema),
  starterCode: z.array(codeSnippetSchema),
  solutionCode: z.array(codeSnippetSchema),
  hints: z.array(z.string()).min(1, "Hints are required"),
});

export const localCodeExerciseContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  command: z.string().min(1, "Command is required"),
  languages: z.array(languageSchema).min(1),
  hasMaterials: z.boolean(),
  hints: z.array(z.string()).optional(),
  solutionCode: z.array(codeSnippetSchema).min(1),
});

export type Language = z.infer<typeof languageSchema>;
export type CodeSnippet = z.infer<typeof codeSnippetSchema>;
export type FillGapsLine = z.infer<typeof fillGapsLineSchema>;
export type ExerciseStagePresentation = z.infer<
  typeof exerciseStagePresentationSchema
>;
export type SelectCorrectAnswerType = z.infer<
  typeof selectCorrectAnswerTypeSchema
>;
export type SelectCorrectAnswer = z.infer<typeof selectCorrectAnswerSchema>;
export type SelectCorrectPrompt = z.infer<typeof selectCorrectPromptSchema>;
export type SelectCorrectStage = z.infer<typeof selectCorrectStageSchema>;
export type FillGapsStage = z.infer<typeof fillGapsStageSchema>;
export type MatchPairsStage = z.infer<typeof matchPairsStageSchema>;
export type FillCodeStage = z.infer<typeof fillCodeStageSchema>;
export type ChooseMatchingItem = z.infer<typeof chooseMatchingItemSchema>;
export type ChooseMatchingStage = z.infer<typeof chooseMatchingStageSchema>;
export type ExerciseStage = z.infer<typeof exerciseStageSchema>;
export type InteractiveExerciseContent = z.infer<
  typeof interactiveExerciseContentSchema
>;
export type CustomExerciseContent = z.infer<typeof customExerciseContentSchema>;
export type PlatformCodeExerciseContent = z.infer<
  typeof platformCodeExerciseContentSchema
>;
export type LocalCodeExerciseContent = z.infer<
  typeof localCodeExerciseContentSchema
>;
