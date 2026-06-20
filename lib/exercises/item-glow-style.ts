import type { CSSProperties } from "react";

export type MatchPairItemState =
  | "idle"
  | "selected"
  | "correct"
  | "matched";

export type MatchPairGlowState = MatchPairItemState | "error";

export function itemGlowStyle(
  state: MatchPairGlowState,
): CSSProperties | undefined {
  switch (state) {
    case "selected":
      return {
        boxShadow:
          "0 0 0 1px var(--accent), 0 0 24px color-mix(in oklab, var(--accent) 45%, transparent)",
      };
    case "correct":
      return {
        boxShadow:
          "0 0 0 1px var(--feedback-success), 0 0 24px color-mix(in oklab, var(--feedback-success) 45%, transparent)",
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
