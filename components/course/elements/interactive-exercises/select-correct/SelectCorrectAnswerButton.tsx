"use client";

import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/lib/course/use-prefers-reduced-motion";
import { itemGlowStyle } from "@/lib/exercises/shared/item-glow-style";
import type { SelectCorrectAnswerVisualState } from "@/lib/exercises/select-correct/select-correct-state";
import { cn } from "@/lib/utils";

import {
  selectCorrectErrorVariants,
  selectCorrectSuccessVariants,
} from "./select-correct-animations";

type SelectCorrectAnswerButtonProps = {
  content: string;
  visualState: SelectCorrectAnswerVisualState;
  explanation: string | null;
  disabled: boolean;
  animationKey: "success" | "error" | null;
  onSelect: () => void;
};

function getGlowStyle(visualState: SelectCorrectAnswerVisualState) {
  switch (visualState) {
    case "correct":
    case "revealedCorrect":
      return itemGlowStyle("success");
    case "incorrect":
      return itemGlowStyle("error");
    default:
      return undefined;
  }
}

export function SelectCorrectAnswerButton({
  content,
  visualState,
  explanation,
  disabled,
  animationKey,
  onSelect,
}: SelectCorrectAnswerButtonProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const glowStyle = getGlowStyle(visualState);

  const motionProps =
    animationKey === "success" && !prefersReducedMotion
      ? {
          variants: selectCorrectSuccessVariants,
          initial: "initial" as const,
          animate: "animate" as const,
        }
      : animationKey === "error" && !prefersReducedMotion
        ? {
            variants: selectCorrectErrorVariants,
            initial: "initial" as const,
            animate: "animate" as const,
          }
        : {};

  return (
    <div className="flex flex-col gap-2">
      <motion.div {...motionProps}>
        <Button
          type="button"
          variant="outline"
          aria-disabled={disabled}
          onClick={disabled ? undefined : onSelect}
          style={glowStyle}
          className={cn(
            "h-auto min-h-12 w-full rounded-lg border bg-card px-4 py-3 text-sm font-normal whitespace-normal text-left transition-[box-shadow,border-color] duration-300",
            visualState === "correct" && "border-feedback-success",
            visualState === "incorrect" && "border-feedback-destructive",
            disabled && "pointer-events-none",
          )}
        >
          {content}
        </Button>
      </motion.div>

      {explanation && (
        <p className="text-sm text-muted-foreground">{explanation}</p>
      )}
    </div>
  );
}
