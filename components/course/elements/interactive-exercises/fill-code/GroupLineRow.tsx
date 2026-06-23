"use client";

import { useMemo } from "react";

import { getClosingTag } from "@/lib/exercises/fill-gaps-utils";
import { sliceColorizedHtml } from "@/lib/monaco/slice-colorized-html";
import { cn } from "@/lib/utils";

import { GapSlot } from "../fill-gaps/GapSlot";
import { GapInputSlot } from "./GapInputSlot";
import type { GroupSegment } from "./group-line-utils";
import { useColorizedGroupLine } from "./use-colorized-group-line";

type GroupLineRowProps = {
  segments: GroupSegment[];
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  language: "html" | "css" | "javascript";
  disabled: boolean;
  gapSpacingClass: string;
  onUpdateGap: (gapId: string, value: string) => void;
  onFocusGap: (gapId: string) => void;
};

function ColorizedSegment({
  html,
  fallback,
  className,
}: {
  html: string | null;
  fallback: string;
  className?: string;
}) {
  if (html) {
    return (
      <span
        className={cn("inline leading-normal", className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span className={cn("inline text-foreground leading-normal", className)}>
      {fallback}
    </span>
  );
}

export function GroupLineRow({
  segments,
  assignments,
  activeGapId,
  language,
  disabled,
  gapSpacingClass,
  onUpdateGap,
  onFocusGap,
}: GroupLineRowProps) {
  const { colorizedHtml, segmentRanges } = useColorizedGroupLine(
    segments,
    assignments,
    language,
  );

  const rangeByIndex = useMemo(
    () => new Map(segmentRanges.map((range) => [range.segmentIndex, range])),
    [segmentRanges],
  );

  return (
    <div className="flex flex-wrap items-center gap-y-1">
      {segments.map((segment, segmentIndex) => {
        if (segment.kind === "gap") {
          return (
            <GapInputSlot
              key={segment.id}
              value={assignments[segment.id] ?? null}
              isActive={!disabled && activeGapId === segment.id}
              disabled={disabled}
              onFocus={() => onFocusGap(segment.id)}
              onChange={(value) => onUpdateGap(segment.id, value)}
            />
          );
        }

        const range = rangeByIndex.get(segmentIndex);
        const slicedHtml =
          colorizedHtml && range
            ? sliceColorizedHtml(
                colorizedHtml,
                range.plainStart,
                range.plainEnd,
              )
            : null;

        if (segment.kind === "text") {
          return (
            <ColorizedSegment
              key={`text-${segmentIndex}`}
              html={slicedHtml}
              fallback={segment.value}
            />
          );
        }

        const pairedValue = assignments[segment.pairedGapId] ?? null;
        const closingTag = pairedValue ? getClosingTag(pairedValue) : null;

        return (
          <GapSlot
            key={segment.id}
            value={closingTag}
            isActive={!disabled && activeGapId === segment.pairedGapId}
            className={gapSpacingClass}
            colorizedHtml={slicedHtml}
          />
        );
      })}
    </div>
  );
}
