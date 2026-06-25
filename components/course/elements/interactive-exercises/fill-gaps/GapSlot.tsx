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
  "inline-flex h-fit min-w-9 items-center justify-center rounded-md border border-border bg-card px-3 py-0.5 font-mono text-inherit text-foreground transition-colors";

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
  const slotClass = cn(
    slotBaseClass,
    isActive && "ring-1 ring-accent",
    className,
  );

  if (value) {
    if (onClear) {
      return (
        <span onClick={onClear} className={slotClass}>
          <SlotContent value={value} colorizedHtml={colorizedHtml} />
        </span>
      );
    }

    return (
      <span className={slotClass}>
        <SlotContent value={value} colorizedHtml={colorizedHtml} />
      </span>
    );
  }

  if (onSelect) {
    return (
      <span onClick={onSelect} className={slotClass} aria-label="Pusta luka">
        <SlotContent value={value} colorizedHtml={colorizedHtml} />
      </span>
    );
  }

  return (
    <span className={slotClass} aria-label="Pusta luka zamykająca">
      <SlotContent value={value} colorizedHtml={colorizedHtml} />
    </span>
  );
}
