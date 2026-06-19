import type { CSSProperties } from "react";

import type { ExerciseFeedback } from "./types";

export function feedbackGlowStyle(
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
