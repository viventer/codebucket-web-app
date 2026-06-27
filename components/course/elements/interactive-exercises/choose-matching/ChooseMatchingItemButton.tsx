"use client";

import { Button } from "@/components/ui/button";
import { itemGlowStyle } from "@/lib/exercises/shared/item-glow-style";
import type { ChooseMatchingItemVisualState } from "@/lib/exercises/choose-matching/choose-matching-state";
import { cn } from "@/lib/utils";

type ChooseMatchingItemButtonProps = {
  content: string;
  visualState: ChooseMatchingItemVisualState;
  disabled: boolean;
  onToggle: () => void;
};

function getGlowStyle(visualState: ChooseMatchingItemVisualState) {
  switch (visualState) {
    case "selected":
      return itemGlowStyle("selected");
    case "correct":
      return itemGlowStyle("success");
    case "missed":
      return itemGlowStyle("warning");
    case "incorrect":
      return itemGlowStyle("error");
    default:
      return undefined;
  }
}

export function ChooseMatchingItemButton({
  content,
  visualState,
  disabled,
  onToggle,
}: ChooseMatchingItemButtonProps) {
  const glowStyle = getGlowStyle(visualState);

  return (
    <Button
      type="button"
      variant="outline"
      aria-pressed={visualState === "selected"}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onToggle}
      style={glowStyle}
      className={cn(
        "h-auto min-h-12 w-full rounded-lg border bg-card px-4 py-3 font-mono text-sm font-normal whitespace-normal transition-[box-shadow,border-color] duration-300",
        visualState === "correct" && "border-feedback-success",
        visualState === "missed" && "border-feedback-warning",
        visualState === "incorrect" && "border-feedback-destructive",
        disabled && "pointer-events-none",
      )}
    >
      {content}
    </Button>
  );
}
