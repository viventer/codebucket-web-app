"use client";

import type { InteractiveExerciseContent } from "@/schemas/courseSchema";

import { ExerciseTypePlaceholder } from "./interactive-exercises/ExerciseTypePlaceholder";
import { FillCodeExercise } from "./interactive-exercises/FillCodeExercise";
import { FillGapsExercise } from "./interactive-exercises/FillGapsExercise";
import { MatchPairsExercise } from "./interactive-exercises/MatchPairsExercise";
import { MultiStageExercise } from "./interactive-exercises/MultiStageExercise";
import { SelectCorrectExercise } from "./interactive-exercises/SelectCorrectExercise";

export function InteractiveExerciseElement({
  content,
}: {
  content: InteractiveExerciseContent;
}) {
  switch (content.type) {
    case "fillGaps":
      return <FillGapsExercise content={content} />;
    case "fillCode":
      return <FillCodeExercise content={content} />;
    case "multiStage":
      return <MultiStageExercise content={content} />;
    case "matchPairs":
      return <MatchPairsExercise content={content} />;
    case "selectCorrect":
      return <SelectCorrectExercise content={content} />;
    default:
      return <ExerciseTypePlaceholder type={content.type} />;
  }
}
