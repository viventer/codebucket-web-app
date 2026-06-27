"use client";

import { useExerciseSession } from "@/lib/exercises/session/ExerciseSessionContext";
import type { SelectCorrectContent } from "@/schemas/courseSchema";

import { SelectCorrectAnswers } from "./select-correct/SelectCorrectAnswers";

type SelectCorrectExerciseProps = {
  content: SelectCorrectContent;
};

export function SelectCorrectExercise({ content }: SelectCorrectExerciseProps) {
  const { controller } = useExerciseSession();

  if (!controller || controller.kind !== "selectCorrect") {
    return null;
  }

  return (
    <SelectCorrectAnswers
      flowPhase="first"
      question={content.question}
      answers={controller.shuffledAnswers}
      prompt={content.prompt}
      isLocked={controller.isLocked}
      selectAnswer={controller.selectAnswer}
      getAnswerVisualState={controller.getAnswerVisualState}
      getWrongExplanation={controller.getWrongExplanation}
      selectedAnswerId={controller.selectedAnswerId}
      phase={controller.phase}
    />
  );
}
