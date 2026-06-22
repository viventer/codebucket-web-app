"use client";

import { useExerciseSessionOptional } from "@/lib/exercises/ExerciseSessionContext";
import { itemGlowStyleFromExerciseFeedback } from "@/lib/exercises/item-glow-style";
import type { FillGapsStageContent } from "@/lib/exercises/fill-gaps-utils";
import { getClosingTag } from "@/lib/exercises/fill-gaps-utils";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";

import { GapSlot } from "./GapSlot";
import { HighlightedCode } from "./HighlightedCode";

const INDENT_PX = 24;

type CodePanelProps = {
  content:
    | FillGapsStageContent
    | {
        language: FillGapsStageContent["language"];
        lines: FillGapsStageContent["lines"];
      };
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  onClearGap: (gapId: string) => void;
  onSelectGap: (gapId: string) => void;
  showFeedbackGlow?: boolean;
  isLocked?: boolean;
};

export function CodePanel({
  content,
  assignments,
  activeGapId,
  onClearGap,
  onSelectGap,
  showFeedbackGlow = true,
  isLocked: isLockedProp,
}: CodePanelProps) {
  const session = useExerciseSessionOptional();
  const feedback = session?.feedback ?? "idle";
  const isLocked = isLockedProp ?? session?.isLocked ?? false;
  const disabled = isLocked;

  const glowStyle =
    showFeedbackGlow && feedback !== "idle"
      ? itemGlowStyleFromExerciseFeedback(feedback)
      : undefined;

  return (
    <Card
      className={cn(
        "font-mono text-sm transition-shadow duration-300 bg-card/30",
        disabled && "pointer-events-none select-none opacity-80",
      )}
      style={glowStyle}
    >
      <CardContent className="flex flex-col gap-4">
        {content.lines.map((line, index) => {
          const style = { paddingLeft: line.indent * INDENT_PX };

          if (line.kind === "code") {
            return (
              <div key={`line-${index}`} style={style}>
                <HighlightedCode text={line.text} language={content.language} />
              </div>
            );
          }

          if (line.kind === "gap") {
            return (
              <div
                key={line.id}
                style={style}
                className="h-fit flex items-center"
              >
                <GapSlot
                  value={assignments[line.id] ?? null}
                  isActive={!disabled && activeGapId === line.id}
                  onSelect={disabled ? undefined : () => onSelectGap(line.id)}
                  onClear={disabled ? undefined : () => onClearGap(line.id)}
                />
              </div>
            );
          }

          if (line.kind === "group") {
            return (
              <div
                key={`group-${index}`}
                style={style}
                className="flex flex-wrap items-center gap-y-1 gap-x-2"
              >
                {line.segments.map((segment, segmentIndex) => {
                  if (segment.kind === "gap") {
                    return (
                      <GapSlot
                        key={segment.id}
                        value={assignments[segment.id] ?? null}
                        isActive={!disabled && activeGapId === segment.id}
                        onSelect={
                          disabled ? undefined : () => onSelectGap(segment.id)
                        }
                        onClear={
                          disabled ? undefined : () => onClearGap(segment.id)
                        }
                      />
                    );
                  }

                  if (segment.kind === "text") {
                    return (
                      <HighlightedCode
                        key={`text-${segmentIndex}`}
                        text={segment.value}
                        language={content.language}
                        className="leading-normal flex items-center"
                      />
                    );
                  }

                  const pairedValue = assignments[segment.pairedGapId] ?? null;
                  const closingTag = pairedValue
                    ? getClosingTag(pairedValue)
                    : null;

                  return (
                    <GapSlot
                      key={segment.id}
                      value={closingTag}
                      isActive={
                        !disabled && activeGapId === segment.pairedGapId
                      }
                      onClear={
                        disabled || !closingTag
                          ? undefined
                          : () => onClearGap(segment.pairedGapId)
                      }
                    />
                  );
                })}
              </div>
            );
          }

          const pairedValue = assignments[line.pairedGapId] ?? null;
          const closingTag = pairedValue ? getClosingTag(pairedValue) : null;

          return (
            <div key={line.id} style={style}>
              <GapSlot
                value={closingTag}
                isActive={!disabled && activeGapId === line.pairedGapId}
                onClear={
                  disabled || !closingTag
                    ? undefined
                    : () => onClearGap(line.pairedGapId)
                }
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
