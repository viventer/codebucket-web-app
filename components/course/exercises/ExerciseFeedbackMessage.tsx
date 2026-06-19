"use client";

import { AnimatePresence, motion } from "motion/react";

import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";
import type { ExerciseFeedback } from "@/lib/exercises/types";
import { cn } from "@/lib/utils";

const FEEDBACK_MESSAGES: Partial<
  Record<ExerciseFeedback, { label: string; text: string; colorClass: string }>
> = {
  success: {
    label: "Sukces!",
    text: "Zadanie wykonane. Możesz przejść do kolejnego rozdziału.",
    colorClass: "text-feedback-success",
  },
  error: {
    label: "Ups!",
    text: "Rozwiązanie jest nieprawidłowe. Spróbuj ponownie.",
    colorClass: "text-feedback-destructive",
  },
  solution: {
    label: "Skip!",
    text: "Zadanie pominięte. Możesz przejść do kolejnego rozdziału.",
    colorClass: "text-feedback-warning",
  },
};

export function ExerciseFeedbackMessage() {
  const { feedback } = useExerciseSession();
  const message = FEEDBACK_MESSAGES[feedback];

  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={feedback}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className={cn("text-sm flex flex-col gap-1", message.colorClass)}
        >
          <p className="font-medium">{message.label}</p>
          <p className="text-muted-foreground">{message.text}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
