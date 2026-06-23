"use client";

import { cn } from "@/lib/utils";

type GapSlotProps = {
  value: string | null;
  isActive: boolean;
  onSelect?: () => void;
  onClear?: () => void;
  className?: string;
  colorizedHtml?: string | null;
};

const slotBaseClass =
  "inline-flex h-fit min-w-9 items-center justify-center rounded-md border border-border bg-card px-3 py-0.5 font-mono text-sm text-foreground transition-colors";

function SlotContent({
  value,
  colorizedHtml,
}: {
  value: string | null;
  colorizedHtml?: string | null;
}) {
  if (colorizedHtml) {
    return <span dangerouslySetInnerHTML={{ __html: colorizedHtml }} />;
  }

  return <>{value || <>&nbsp;</>}</>;
}

export function GapSlot({
  value,
  isActive,
  onSelect,
  onClear,
  className,
  colorizedHtml,
}: GapSlotProps) {
  const activeClass = isActive ? "ring-1 ring-accent" : undefined;

  if (value) {
    if (onClear) {
      return (
        <span
          onClick={onClear}
          className={cn(slotBaseClass, activeClass, className)}
        >
          <SlotContent value={value} colorizedHtml={colorizedHtml} />
        </span>
      );
    }

    return (
      <span className={cn(slotBaseClass, activeClass, className)}>
        <SlotContent value={value} colorizedHtml={colorizedHtml} />
      </span>
    );
  }

  if (onSelect) {
    return (
      <span
        onClick={onSelect}
        className={cn(slotBaseClass, activeClass, className)}
        aria-label="Pusta luka"
      >
        <SlotContent value={value} colorizedHtml={colorizedHtml} />
      </span>
    );
  }

  return (
    <span
      className={cn(slotBaseClass, activeClass, className)}
      aria-label="Pusta luka zamykająca"
    >
      <SlotContent value={value} colorizedHtml={colorizedHtml} />
    </span>
  );
}
