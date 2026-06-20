"use client";

import { Button } from "@/components/ui/button";
import {
  itemGlowStyle,
  type MatchPairItemState,
} from "@/lib/exercises/item-glow-style";
import { cn } from "@/lib/utils";

type MatchPairItemProps = {
  text: string;
  state: MatchPairItemState;
  showErrorFlash: boolean;
  isDisabled: boolean;
  mono?: boolean;
  onSelect: () => void;
};

export function MatchPairItem({
  text,
  state,
  showErrorFlash,
  isDisabled,
  mono = false,
  onSelect,
}: MatchPairItemProps) {
  const showError =
    showErrorFlash &&
    state !== "selected" &&
    state !== "correct" &&
    state !== "matched";
  const glowState =
    state === "matched"
      ? "idle"
      : showError
        ? "error"
        : state === "selected" || state === "correct"
          ? state
          : "idle";
  const glowStyle =
    glowState === "idle" ? undefined : itemGlowStyle(glowState);

  return (
    <Button
      type="button"
      variant="outline"
      aria-disabled={isDisabled}
      onClick={isDisabled ? undefined : onSelect}
      style={glowStyle}
      className={cn(
        "h-full min-h-12 w-full rounded-lg border bg-card px-4 py-3 text-sm font-normal whitespace-normal text-left transition-[opacity,box-shadow,border-color] duration-300",
        mono && "font-mono",
        state === "selected" && "border-accent",
        state === "correct" && "border-feedback-success",
        showError && "border-feedback-destructive",
        isDisabled && "pointer-events-none",
        state === "matched" && "opacity-30",
      )}
    >
      {text}
    </Button>
  );
}
