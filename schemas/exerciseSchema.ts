import { z } from "zod";

export const languageSchema = z.enum(["javascript", "html", "css"]);

export const codeSnippetSchema = z.object({
  language: languageSchema,
  code: z.string().min(1, "Code is required"),
});

export const interactiveExerciseTypeSchema = z.enum([
  "fillGaps",
  "multiStage",
  "matchPairs",
  "fillCode",
  "selectCorrect",
  "custom",
]);

const interactiveExerciseBaseSchema = {
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

export const fillGapsContentSchema = z.object({
  ...interactiveExerciseBaseSchema,
  type: z.literal("fillGaps"),
  language: languageSchema,
  lines: z.array(fillGapsLineSchema).min(1),
  options: z.array(z.string().min(1)).min(1),
  previewHtml: z.string().min(1).optional(),
});

export const multiStageStagePresentationSchema = z.discriminatedUnion("kind", [
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

export const selectCorrectContentSchema = z.object({
  ...interactiveExerciseBaseSchema,
  type: z.literal("selectCorrect"),
  ...selectCorrectFieldsSchema,
});

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
  presentation: multiStageStagePresentationSchema.optional(),
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
  presentation: multiStageStagePresentationSchema.optional(),
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

export const multiStageStageSchema = z.discriminatedUnion("type", [
  selectCorrectStageSchema,
  chooseMatchingStageSchema,
  fillGapsStageSchema,
  matchPairsStageSchema,
  fillCodeStageSchema,
]);

export const multiStageContentSchema = z.object({
  ...interactiveExerciseBaseSchema,
  type: z.literal("multiStage"),
  stages: z.array(multiStageStageSchema).min(2),
});

export const matchPairsContentSchema = z.object({
  ...interactiveExerciseBaseSchema,
  type: z.literal("matchPairs"),
  pairs: z.array(matchPairSchema).min(2),
});

export const fillCodeContentSchema = z.object({
  ...interactiveExerciseBaseSchema,
  type: z.literal("fillCode"),
  language: languageSchema,
  lines: z.array(fillGapsLineSchema).min(1),
  previewHtml: z.string().min(1).optional(),
});

export const customInteractiveExerciseContentSchema = z.object({
  ...interactiveExerciseBaseSchema,
  type: z.literal("custom"),
  component: z.string().min(1, "Component is required"),
});

export const interactiveExerciseContentSchema = z.discriminatedUnion("type", [
  fillGapsContentSchema,
  multiStageContentSchema,
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

export type Language = z.infer<typeof languageSchema>;
export type CodeSnippet = z.infer<typeof codeSnippetSchema>;
export type InteractiveExerciseType = z.infer<
  typeof interactiveExerciseTypeSchema
>;
export type FillGapsLine = z.infer<typeof fillGapsLineSchema>;
export type FillGapsContent = z.infer<typeof fillGapsContentSchema>;
export type MultiStageStagePresentation = z.infer<
  typeof multiStageStagePresentationSchema
>;
export type SelectCorrectAnswerType = z.infer<
  typeof selectCorrectAnswerTypeSchema
>;
export type SelectCorrectAnswer = z.infer<typeof selectCorrectAnswerSchema>;
export type SelectCorrectPrompt = z.infer<typeof selectCorrectPromptSchema>;
export type SelectCorrectContent = z.infer<typeof selectCorrectContentSchema>;
export type SelectCorrectStage = z.infer<typeof selectCorrectStageSchema>;
export type FillGapsStage = z.infer<typeof fillGapsStageSchema>;
export type MatchPairsStage = z.infer<typeof matchPairsStageSchema>;
export type FillCodeStage = z.infer<typeof fillCodeStageSchema>;
export type ChooseMatchingItem = z.infer<typeof chooseMatchingItemSchema>;
export type ChooseMatchingStage = z.infer<typeof chooseMatchingStageSchema>;
export type MultiStageStage = z.infer<typeof multiStageStageSchema>;
export type MultiStageContent = z.infer<typeof multiStageContentSchema>;
export type MatchPairsContent = z.infer<typeof matchPairsContentSchema>;
export type FillCodeContent = z.infer<typeof fillCodeContentSchema>;
export type InteractiveExerciseContent = z.infer<
  typeof interactiveExerciseContentSchema
>;
export type CodeExerciseContent = z.infer<typeof codeExerciseContentSchema>;
