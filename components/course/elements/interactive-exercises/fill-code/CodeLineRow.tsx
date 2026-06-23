"use client";

import { useMemo } from "react";

import { getClosingTag } from "@/lib/exercises/fill-gaps-utils";
import { sliceColorizedHtml } from "@/lib/monaco/slice-colorized-html";
import type { Language } from "@/schemas/courseSchema";

import { GapSlot } from "../fill-gaps/GapSlot";
import { GapInputSlot } from "./GapInputSlot";
import type { CodeLineSegment } from "./line-segments";
import { useColorizedLine } from "./use-colorized-line";

const gapSpacingClass = "mx-1";

type CodeLineRowProps = {
  segments: CodeLineSegment[];
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  language: Language;
  disabled: boolean;
  onUpdateGap: (gapId: string, value: string) => void;
  onFocusGap: (gapId: string) => void;
};

function ColorizedText({
  html,
  fallback,
}: {
  html: string | null;
  fallback: string;
}) {
  if (html) {
    return (
      <span
        className="inline leading-normal"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span className="inline text-foreground leading-normal">{fallback}</span>
  );
}

export function CodeLineRow({
  segments,
  assignments,
  activeGapId,
  language,
  disabled,
  onUpdateGap,
  onFocusGap,
}: CodeLineRowProps) {
  const { colorizedHtml, segmentRanges } = useColorizedLine(
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
            <ColorizedText
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
            colorizedHtml={closingTag ? slicedHtml : null}
          />
        );
      })}
    </div>
  );
}
