"use client";

import type { InteractiveExerciseContent } from "@/schemas/courseSchema";

import { ExerciseTypePlaceholder } from "./interactive-exercises/ExerciseTypePlaceholder";
import { FillGapsExercise } from "./interactive-exercises/FillGapsExercise";
import { MatchPairsExercise } from "./interactive-exercises/MatchPairsExercise";
import { MultiStageFillGapsExercise } from "./interactive-exercises/MultiStageFillGapsExercise";

export function InteractiveExerciseElement({
  content,
}: {
  content: InteractiveExerciseContent;
}) {
  switch (content.type) {
    case "fillGaps":
      return <FillGapsExercise content={content} />;
    case "multiStageFillGaps":
      return <MultiStageFillGapsExercise content={content} />;
    case "matchPairs":
      return <MatchPairsExercise content={content} />;
    default:
      return <ExerciseTypePlaceholder type={content.type} />;
  }
}
