import type { CSSProperties } from "react";

export type MatchPairItemState = "idle" | "selected" | "correct" | "matched";

export type ItemGlowState =
  | "selected"
  | "correct"
  | "error"
  | "success"
  | "warning";

export type ExerciseFeedbackGlowInput =
  | "idle"
  | "success"
  | "stageSuccess"
  | "stageSolution"
  | "error"
  | "warning"
  | "solution";

export function itemGlowStyle(state: ItemGlowState): CSSProperties | undefined {
  switch (state) {
    case "selected":
      return {
        boxShadow:
          "0 0 0 1px var(--accent), 0 0 24px color-mix(in oklab, var(--accent) 30%, transparent)",
      };
    case "correct":
    case "success":
      return {
        boxShadow:
          "0 0 0 1px var(--feedback-success), 0 0 24px color-mix(in oklab, var(--feedback-success) 30%, transparent)",
      };
    case "error":
      return {
        boxShadow:
          "0 0 0 1px var(--feedback-destructive), 0 0 24px color-mix(in oklab, var(--feedback-destructive) 30%, transparent)",
      };
    case "warning":
      return {
        boxShadow:
          "0 0 0 1px var(--feedback-warning), 0 0 24px color-mix(in oklab, var(--feedback-warning) 30%, transparent)",
      };
  }
}

export function itemGlowStyleFromExerciseFeedback(
  feedback: ExerciseFeedbackGlowInput,
): CSSProperties | undefined {
  switch (feedback) {
    case "success":
    case "stageSuccess":
      return itemGlowStyle("success");
    case "error":
      return itemGlowStyle("error");
    case "stageSolution":
    case "solution":
    case "warning":
      return itemGlowStyle("warning");
    default:
      return undefined;
  }
}
