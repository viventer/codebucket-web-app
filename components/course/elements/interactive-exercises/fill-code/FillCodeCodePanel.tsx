"use client";

import { useExerciseSessionOptional } from "@/lib/exercises/ExerciseSessionContext";
import { itemGlowStyleFromExerciseFeedback } from "@/lib/exercises/item-glow-style";
import type { GapLinesContent } from "@/lib/exercises/fill-gaps-utils";
import { getClosingTag } from "@/lib/exercises/fill-gaps-utils";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";

import { GapSlot } from "../fill-gaps/GapSlot";
import { HighlightedCode } from "../fill-gaps/HighlightedCode";
import { GapInputSlot } from "./GapInputSlot";
import { GroupLineRow } from "./GroupLineRow";

const INDENT_PX = 24;
const gapSpacingClass = "mx-1";

type FillCodeCodePanelProps = {
  content: GapLinesContent;
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  onUpdateGap: (gapId: string, value: string) => void;
  onFocusGap: (gapId: string) => void;
  showFeedbackGlow?: boolean;
  isLocked?: boolean;
};

export function FillCodeCodePanel({
  content,
  assignments,
  activeGapId,
  onUpdateGap,
  onFocusGap,
  showFeedbackGlow = true,
  isLocked: isLockedProp,
}: FillCodeCodePanelProps) {
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
        "font-mono text-sm transition-shadow max-w-[90vw] duration-300 bg-card/30 overflow-auto",
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
                <GapInputSlot
                  value={assignments[line.id] ?? null}
                  isActive={!disabled && activeGapId === line.id}
                  disabled={disabled}
                  onFocus={() => onFocusGap(line.id)}
                  onChange={(value) => onUpdateGap(line.id, value)}
                />
              </div>
            );
          }

          if (line.kind === "group") {
            return (
              <div key={`group-${index}`} style={style}>
                <GroupLineRow
                  segments={line.segments}
                  assignments={assignments}
                  activeGapId={activeGapId}
                  language={content.language}
                  disabled={disabled}
                  gapSpacingClass={gapSpacingClass}
                  onUpdateGap={onUpdateGap}
                  onFocusGap={onFocusGap}
                />
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
                className={gapSpacingClass}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
