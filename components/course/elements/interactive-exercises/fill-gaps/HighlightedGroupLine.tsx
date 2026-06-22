"use client";

import { useEffect, useMemo, useState } from "react";

import {
  buildGroupLineColorizeText,
  buildGroupLineParts,
  mergeColorizedHtmlWithGaps,
  stripGapColorizePlaceholders,
  type GroupLineColorizedPart,
  type GroupLineSegment,
} from "@/lib/exercises/fill-gaps-group-line";
import { getClosingTag } from "@/lib/exercises/fill-gaps-utils";
import { colorizeCode } from "@/lib/monaco/setup";
import { useCodeTheme } from "@/lib/monaco/use-code-theme";
import type { Language } from "@/schemas/courseSchema";
import { cn } from "@/lib/utils";

import { GapSlot } from "./GapSlot";

type HighlightedGroupLineProps = {
  segments: GroupLineSegment[];
  language: Language;
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  disabled: boolean;
  onSelectGap: (gapId: string) => void;
  onClearGap: (gapId: string) => void;
  className?: string;
};

export function HighlightedGroupLine({
  segments,
  language,
  assignments,
  activeGapId,
  disabled,
  onSelectGap,
  onClearGap,
  className,
}: HighlightedGroupLineProps) {
  const mode = useCodeTheme();
  const parts = useMemo(
    () => buildGroupLineParts(segments, assignments),
    [segments, assignments],
  );
  const colorizeText = useMemo(
    () => buildGroupLineColorizeText(parts),
    [parts],
  );
  const segmentById = useMemo(
    () =>
      new Map(segments.filter((s) => s.kind !== "text").map((s) => [s.id, s])),
    [segments],
  );
  const [colorizedParts, setColorizedParts] = useState<
    GroupLineColorizedPart[] | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    void colorizeCode(colorizeText, language, mode).then((html) => {
      if (cancelled) return;
      setColorizedParts(mergeColorizedHtmlWithGaps(html, parts));
    });

    return () => {
      cancelled = true;
    };
  }, [colorizeText, language, mode, parts]);

  if (!colorizedParts) {
    return (
      <span className={cn("inline text-foreground", className)}>
        {stripGapColorizePlaceholders(colorizeText)}
      </span>
    );
  }

  return (
    <span
      className={cn("inline-flex flex-wrap items-center gap-y-1", className)}
    >
      {colorizedParts.map((part, index) => {
        if (part.kind === "html") {
          if (!part.value) return null;

          return (
            <span
              key={`html-${index}`}
              className="inline leading-normal"
              dangerouslySetInnerHTML={{ __html: part.value }}
            />
          );
        }

        const segment = segmentById.get(part.id);

        return (
          <GapSlot
            key={part.id}
            value={getSegmentDisplayValue(segment, assignments)}
            isActive={
              !disabled &&
              !!segment &&
              activeGapId === getGapInteractionId(segment, part.id)
            }
            onSelect={
              disabled || !segment
                ? undefined
                : () => onSelectGap(getGapInteractionId(segment, part.id))
            }
            onClear={
              disabled || !segment
                ? undefined
                : () => onClearGap(getGapInteractionId(segment, part.id))
            }
          />
        );
      })}
    </span>
  );
}

function getSegmentDisplayValue(
  segment: GroupLineSegment | undefined,
  assignments: Record<string, string | null>,
): string | null {
  if (!segment || segment.kind === "text") return null;

  if (segment.kind === "gap") {
    return assignments[segment.id] ?? null;
  }

  const pairedValue = assignments[segment.pairedGapId] ?? null;
  return pairedValue ? getClosingTag(pairedValue) : null;
}

function getGapInteractionId(
  segment: Extract<GroupLineSegment, { kind: "gap" | "autoClose" }>,
  fallbackId: string,
): string {
  return segment.kind === "autoClose" ? segment.pairedGapId : segment.id;
}
