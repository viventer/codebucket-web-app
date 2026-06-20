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
  "inline-flex h-fit min-w-9 items-center justify-center rounded-md border border-border bg-card px-3 py-0.5 font-mono text-sm text-foreground transition-colors";

export function GapSlot({ value, isActive, onSelect, onClear }: GapSlotProps) {
  const activeClass = isActive ? "ring-1 ring-accent" : undefined;

  if (value) {
    if (onClear) {
      return (
        <span onClick={onClear} className={cn(slotBaseClass, activeClass)}>
          {value || <>&nbsp;</>}
        </span>
      );
    }

    return (
      <span className={cn(slotBaseClass, activeClass)}>
        {value || <>&nbsp;</>}
      </span>
    );
  }

  if (onSelect) {
    return (
      <span
        onClick={onSelect}
        className={cn(slotBaseClass, activeClass)}
        aria-label="Pusta luka"
      >
        {value || <>&nbsp;</>}
      </span>
    );
  }

  return (
    <span
      className={cn(slotBaseClass, activeClass)}
      aria-label="Pusta luka zamykająca"
    >
      &nbsp;
    </span>
  );
}
