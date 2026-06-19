"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GapSlotProps = {
  value: string | null;
  isActive: boolean;
  onSelect?: () => void;
  onClear?: () => void;
};

const slotBaseClass =
  "inline-flex min-h-8 min-w-28 items-center justify-center rounded-lg border border-border bg-card px-3 py-1 font-mono text-sm text-foreground transition-colors";

export function GapSlot({ value, isActive, onSelect, onClear }: GapSlotProps) {
  const activeClass = isActive ? "ring-1 ring-accent" : undefined;

  if (value) {
    if (onClear) {
      return (
        <Button
          onClick={onClear}
          variant="outline"
          className={cn(slotBaseClass, "min-w-20", activeClass)}
        >
          {value}
        </Button>
      );
    }

    return (
      <span className={cn(slotBaseClass, "min-w-20", activeClass)}>
        {value}
      </span>
    );
  }

  if (onSelect) {
    return (
      <Button
        variant="outline"
        onClick={onSelect}
        className={cn(slotBaseClass, "hover:bg-secondary/40", activeClass)}
        aria-label="Pusta luka"
      >
        {value}
      </Button>
    );
  }

  return (
    <span
      className={cn(slotBaseClass, activeClass)}
      aria-label="Pusta luka zamykająca"
    />
  );
}
