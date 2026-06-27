"use client";

import type { InteractiveExerciseContent } from "@/schemas/courseSchema";

import { ExerciseTypePlaceholder } from "./interactive-exercises/ExerciseTypePlaceholder";
import { MultiStageExercise } from "./interactive-exercises/MultiStageExercise";

export function InteractiveExerciseElement({
  content,
}: {
  content: InteractiveExerciseContent;
}) {
  if (content.type === "multiStage") {
    return <MultiStageExercise content={content} />;
  }

  return <ExerciseTypePlaceholder type={content.type} />;
}
