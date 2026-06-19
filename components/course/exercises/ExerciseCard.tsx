"use client";

import type { CSSProperties, ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";
import type { ExerciseFeedback } from "@/lib/exercises/types";
import { cn } from "@/lib/utils";

import { ExerciseFeedbackMessage } from "./ExerciseFeedbackMessage";

function feedbackGlowStyle(
  feedback: ExerciseFeedback,
): CSSProperties | undefined {
  switch (feedback) {
    case "success":
      return {
        boxShadow:
          "0 0 0 1px var(--feedback-success), 0 0 24px color-mix(in oklab, var(--feedback-success) 45%, transparent)",
      };
    case "solution":
    case "warning":
      return {
        boxShadow:
          "0 0 0 1px var(--feedback-warning), 0 0 24px color-mix(in oklab, var(--feedback-warning) 45%, transparent)",
      };
    case "error":
      return {
        boxShadow:
          "0 0 0 1px var(--feedback-destructive), 0 0 24px color-mix(in oklab, var(--feedback-destructive) 45%, transparent)",
      };
    default:
      return undefined;
  }
}

export function ExerciseCard({ children }: { children: ReactNode }) {
  const { feedback, isLocked } = useExerciseSession();

  return (
    <div className="flex flex-col gap-8">
      <Card
        className={cn(
          "transition-shadow duration-300",
          isLocked && "pointer-events-none select-none opacity-80",
        )}
        style={feedbackGlowStyle(feedback)}
      >
        <CardContent>{children}</CardContent>
      </Card>
      <ExerciseFeedbackMessage />
    </div>
  );
}
