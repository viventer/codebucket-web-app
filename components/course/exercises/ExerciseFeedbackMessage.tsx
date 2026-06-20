"use client";

import { AnimatePresence, motion } from "motion/react";

import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";
import { EXERCISE_INLINE_FEEDBACK_MESSAGES } from "@/lib/exercises/exercise-feedback-messages";
import { cn } from "@/lib/utils";

export function ExerciseFeedbackMessage() {
  const { feedback } = useExerciseSession();
  const message = EXERCISE_INLINE_FEEDBACK_MESSAGES[feedback];

  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={feedback}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className={cn("flex flex-col gap-1 text-sm", message.colorClass)}
        >
          <p className="font-medium">{message.label}</p>
          <p className="text-muted-foreground">{message.text}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
