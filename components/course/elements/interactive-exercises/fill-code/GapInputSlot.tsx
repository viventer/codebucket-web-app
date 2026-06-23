"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type GapInputSlotProps = {
  value: string | null;
  isActive: boolean;
  onFocus: () => void;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const slotBaseClass =
  "mx-1 inline-flex h-fit min-w-9 items-center rounded-md border border-border bg-card px-2 py-0.5 font-mono text-sm transition-colors";

export function GapInputSlot({
  value,
  isActive,
  onFocus,
  onChange,
  disabled = false,
}: GapInputSlotProps) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(36);
  const displayValue = value ?? "";

  useEffect(() => {
    if (!measureRef.current) return;
    setInputWidth(Math.max(36, measureRef.current.offsetWidth + 8));
  }, [displayValue]);

  const activeClass = isActive ? "ring-1 ring-accent" : undefined;

  return (
    <span className={cn(slotBaseClass, activeClass, "relative")}>
      <span
        ref={measureRef}
        className="pointer-events-none invisible absolute whitespace-pre font-mono text-sm"
        aria-hidden
      >
        {displayValue || " "}
      </span>
      <input
        type="text"
        value={displayValue}
        disabled={disabled}
        onFocus={onFocus}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "bg-transparent font-mono text-sm text-foreground outline-none",
          disabled && "cursor-not-allowed",
        )}
        style={{ width: inputWidth }}
        aria-label="Luka do uzupełnienia"
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </span>
  );
}
