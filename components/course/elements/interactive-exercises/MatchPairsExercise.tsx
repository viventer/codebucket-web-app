"use client";

import { ExerciseFeedbackMessage } from "@/components/course/exercises/ExerciseFeedbackMessage";
import { useExerciseSession } from "@/lib/exercises/session/ExerciseSessionContext";
import type { MatchPairsContent } from "@/schemas/courseSchema";

import { MatchPairsBoard } from "./match-pairs/MatchPairsBoard";

type MatchPairsExerciseProps = {
  content: MatchPairsContent;
};

export function MatchPairsExercise({ content }: MatchPairsExerciseProps) {
  const { controller } = useExerciseSession();

  if (!controller || controller.kind !== "matchPairs") {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <h3 className="text-base font-medium">{content.command}</h3>
      <MatchPairsBoard controller={controller} />
      <ExerciseFeedbackMessage />
    </div>
  );
}
