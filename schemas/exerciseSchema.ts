import { z } from "zod";

export const languageSchema = z.enum(["javascript", "html", "css"]);

export const codeSnippetSchema = z.object({
  language: languageSchema,
  code: z.string().min(1, "Code is required"),
});

export const interactiveExerciseTypeSchema = z.enum([
  "fillGaps",
  "multiStageFillGaps",
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

const multiStageFillGapsStageBaseSchema = {
  language: languageSchema,
  lines: z.array(fillGapsLineSchema).min(1),
  options: z.array(z.string().min(1)).min(1),
  command: z.string().min(1).optional(),
};

export const multiStageFillGapsStagePresentationSchema =
  z.discriminatedUnion("kind", [
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

export const multiStageFillGapsStageSchema = z.object({
  ...multiStageFillGapsStageBaseSchema,
  presentation: multiStageFillGapsStagePresentationSchema,
});

export const multiStageFillGapsContentSchema = z.object({
  ...interactiveExerciseBaseSchema,
  type: z.literal("multiStageFillGaps"),
  stages: z.array(multiStageFillGapsStageSchema).min(2),
});

export const matchPairSchema = z.object({
  left: z.string().min(1),
  right: z.string().min(1),
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
  multiStageFillGapsContentSchema,
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
export type MultiStageFillGapsStagePresentation = z.infer<
  typeof multiStageFillGapsStagePresentationSchema
>;
export type MultiStageFillGapsStage = z.infer<
  typeof multiStageFillGapsStageSchema
>;
export type MultiStageFillGapsContent = z.infer<
  typeof multiStageFillGapsContentSchema
>;
export type MatchPairsContent = z.infer<typeof matchPairsContentSchema>;
export type FillCodeContent = z.infer<typeof fillCodeContentSchema>;
export type InteractiveExerciseContent = z.infer<
  typeof interactiveExerciseContentSchema
>;
export type CodeExerciseContent = z.infer<typeof codeExerciseContentSchema>;
