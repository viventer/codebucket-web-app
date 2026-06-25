"use client";

import { getClosingTag } from "@/lib/exercises/fill-gaps/fill-gaps-utils";
import { sliceColorizedHtml } from "@/lib/monaco/slice-colorized-html";
import type { Language } from "@/schemas/courseSchema";

import { GapInputSlot } from "../fill-code/GapInputSlot";
import { GapSlot } from "../fill-gaps/GapSlot";
import type { CodeLineSegment } from "./line-segments";
import { useColorizedLine } from "./use-colorized-line";

const gapSpacingClass = "mx-1";

type CodeLineRowBaseProps = {
  segments: CodeLineSegment[];
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  language: Language;
  disabled: boolean;
};

type CodeLineRowInputProps = CodeLineRowBaseProps & {
  gapMode: "input";
  onUpdateGap: (gapId: string, value: string) => void;
  onFocusGap: (gapId: string) => void;
};

type CodeLineRowSelectProps = CodeLineRowBaseProps & {
  gapMode: "select";
  onSelectGap: (gapId: string) => void;
  onClearGap: (gapId: string) => void;
};

export type CodeLineRowProps = CodeLineRowInputProps | CodeLineRowSelectProps;

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

export function CodeLineRow(props: CodeLineRowProps) {
  const {
    segments,
    assignments,
    activeGapId,
    language,
    disabled,
    gapMode,
  } = props;

  const { colorizedHtml, segmentRanges } = useColorizedLine(
    segments,
    assignments,
    language,
  );

  const rangeByIndex = new Map(
    segmentRanges.map((range) => [range.segmentIndex, range]),
  );

  return (
    <div className="flex flex-wrap items-center gap-y-1">
      {segments.map((segment, segmentIndex) => {
        if (segment.kind === "gap") {
          if (gapMode === "input") {
            return (
              <GapInputSlot
                key={segment.id}
                value={assignments[segment.id] ?? null}
                isActive={!disabled && activeGapId === segment.id}
                disabled={disabled}
                onFocus={() => props.onFocusGap(segment.id)}
                onChange={(value) => props.onUpdateGap(segment.id, value)}
              />
            );
          }

          return (
            <GapSlot
              key={segment.id}
              value={assignments[segment.id] ?? null}
              isActive={!disabled && activeGapId === segment.id}
              className={gapSpacingClass}
              onSelect={
                disabled ? undefined : () => props.onSelectGap(segment.id)
              }
              onClear={
                disabled ? undefined : () => props.onClearGap(segment.id)
              }
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
            onClear={
              gapMode === "select" && !disabled && closingTag
                ? () => props.onClearGap(segment.pairedGapId)
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
