"use client";

import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";
import { itemGlowStyleFromExerciseFeedback } from "@/lib/exercises/item-glow-style";
import type { FillGapsContent } from "@/schemas/courseSchema";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";

import { GapSlot } from "./GapSlot";
import { getClosingTag } from "./getClosingTag";
import { HighlightedCode } from "./HighlightedCode";

const INDENT_PX = 24;

type CodePanelProps = {
  content: FillGapsContent;
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  onClearGap: (gapId: string) => void;
  onSelectGap: (gapId: string) => void;
};

export function CodePanel({
  content,
  assignments,
  activeGapId,
  onClearGap,
  onSelectGap,
}: CodePanelProps) {
  const { feedback, isLocked } = useExerciseSession();
  const disabled = isLocked;

  return (
    <Card
      className={cn(
        "font-mono text-sm  transition-shadow duration-300",
        isLocked && "pointer-events-none select-none opacity-80",
      )}
      style={itemGlowStyleFromExerciseFeedback(feedback)}
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
