"use client";

import { motion } from "motion/react";
import { useParams } from "next/navigation";

import { usePrefersReducedMotion } from "@/lib/course/use-prefers-reduced-motion";
import type {
  SelectCorrectAnswerVisualState,
  SelectCorrectPhase,
} from "@/lib/exercises/select-correct/select-correct-state";
import type { SelectCorrectPrompt } from "@/schemas/courseSchema";

import { SelectCorrectAnswerButton } from "./SelectCorrectAnswerButton";
import { SELECT_CORRECT_CODE_INSTRUCTION } from "./constants";
import { SelectCorrectPromptContent } from "./SelectCorrectPrompt";
import { selectCorrectListSuccessVariants } from "./select-correct-animations";
import { RotateCcwIcon } from "lucide-react";

type SelectCorrectAnswersProps = {
  flowPhase: "first" | "retry";
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
  flowPhase,
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

  let listAnimationKey: "success" | "error" | null = null;
  if (phase === "correct") {
    listAnimationKey = "success";
  } else if (
    phase === "wrongPending" ||
    phase === "wrongDeferred" ||
    phase === "wrongResolved"
  ) {
    listAnimationKey = "error";
  }

  const wrongExplanation = getWrongExplanation();
  const hasCodePrompt = prompt?.kind === "code";

  const content = (
    <div className="flex flex-col gap-4 sm:gap-6">
      {flowPhase === "retry" && (
        <div className="flex items-center gap-2 text-sm font-light text text-feedback-warning">
          <RotateCcwIcon className="size-4" />
          <p>Ponowna próba</p>
        </div>
      )}

      {hasCodePrompt ? (
        <>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {SELECT_CORRECT_CODE_INSTRUCTION}
            </p>
            <SelectCorrectPromptContent courseId={courseId} prompt={prompt} />
          </div>
          <p className="text-base font-medium">{question}</p>
        </>
      ) : (
        <>
          <p className="text-base font-medium">{question}</p>
          {prompt && (
            <SelectCorrectPromptContent courseId={courseId} prompt={prompt} />
          )}
        </>
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
