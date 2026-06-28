"use client";

import type { InteractiveExerciseContent } from "@/schemas/courseSchema";

import { InteractiveExerciseStages } from "./interactive-exercises/InteractiveExerciseStages";

export function InteractiveExerciseElement({
  content,
}: {
  content: InteractiveExerciseContent;
}) {
  return <InteractiveExerciseStages content={content} />;
}
