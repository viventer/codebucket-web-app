"use client";

import type { InteractiveExerciseContent } from "@/schemas/courseSchema";

import { InteractiveExerciseStages } from "./interactive-exercises/InteractiveExerciseStages";

export function InteractiveExerciseElement({
  content,
  assetUrls,
}: {
  content: InteractiveExerciseContent;
  assetUrls: Record<string, string>;
}) {
  return (
    <InteractiveExerciseStages content={content} assetUrls={assetUrls} />
  );
}
