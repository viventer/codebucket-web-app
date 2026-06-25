"use client";

import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import { usePrefersReducedMotion } from "@/lib/course/use-prefers-reduced-motion";
import type {
  SelectCorrectAnswerVisualState,
  SelectCorrectPhase,
} from "@/lib/exercises/select-correct/select-correct-state";
import type { SelectCorrectPrompt } from "@/schemas/courseSchema";

import { SelectCorrectAnswerButton } from "./SelectCorrectAnswerButton";
import { SelectCorrectPromptContent } from "./SelectCorrectPrompt";
import { selectCorrectListSuccessVariants } from "./select-correct-animations";

type SelectCorrectAnswersProps = {
  question: string;
  answers: { id: number; content: string }[];
  prompt?: SelectCorrectPrompt;
  isLocked: boolean;
  selectAnswer: (answerId: number) => void;
  getAnswerVisualState: (answerId: number) => SelectCorrectAnswerVisualState;
  getWrongExplanation: () => string | null;
  selectedAnswerId: number | null;
  phase: SelectCorrectPhase;
};

export function SelectCorrectAnswers({
  question,
  answers,
  prompt,
  isLocked,
  selectAnswer,
  getAnswerVisualState,
  getWrongExplanation,
  selectedAnswerId,
  phase,
}: SelectCorrectAnswersProps) {
  const params = useParams<{ id: string }>();
  const courseId = params.id;
  const prefersReducedMotion = usePrefersReducedMotion();

  const listAnimationKey = useMemo(() => {
    if (phase === "correct") {
      return "success" as const;
    }
    if (phase === "wrongPending" || phase === "wrongResolved") {
      return "error" as const;
    }
    return null;
  }, [phase]);

  const wrongExplanation = getWrongExplanation();

  const content = (
    <div className="flex flex-col gap-4 sm:gap-6">
      <p className="text-base font-medium">{question}</p>

      {prompt && (
        <SelectCorrectPromptContent courseId={courseId} prompt={prompt} />
      )}

      <div className="flex flex-col gap-3">
        {answers.map((answer) => {
          const visualState = getAnswerVisualState(answer.id);
          const isSelectedWrong =
            answer.id === selectedAnswerId && phase !== "correct";
          const animationKey =
            answer.id === selectedAnswerId ? listAnimationKey : null;

          return (
            <SelectCorrectAnswerButton
              key={answer.id}
              content={answer.content}
              visualState={visualState}
              explanation={isSelectedWrong ? wrongExplanation : null}
              disabled={isLocked}
              animationKey={animationKey}
              onSelect={() => selectAnswer(answer.id)}
            />
          );
        })}
      </div>
    </div>
  );

  if (listAnimationKey === "success" && !prefersReducedMotion) {
    return (
      <motion.div
        variants={selectCorrectListSuccessVariants}
        initial="initial"
        animate="animate"
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
