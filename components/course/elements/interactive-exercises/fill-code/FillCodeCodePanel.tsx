"use client";

import { useExerciseSessionOptional } from "@/lib/exercises/ExerciseSessionContext";
import { itemGlowStyleFromExerciseFeedback } from "@/lib/exercises/item-glow-style";
import type { GapLinesContent } from "@/lib/exercises/fill-gaps-utils";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";

import { CodeLineRow } from "./CodeLineRow";
import { lineToSegments } from "./line-segments";

const INDENT_PX = 24;

type FillCodeCodePanelProps = {
  content: GapLinesContent;
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  onUpdateGap: (gapId: string, value: string) => void;
  onFocusGap: (gapId: string) => void;
  showFeedbackGlow?: boolean;
  isLocked?: boolean;
};

function getLineKey(
  line: GapLinesContent["lines"][number],
  index: number,
): string {
  if (line.kind === "code") return `code-${index}`;
  if (line.kind === "group") return `group-${index}`;
  return line.id;
}

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
        {content.lines.map((line, index) => (
          <div
            key={getLineKey(line, index)}
            style={{ paddingLeft: line.indent * INDENT_PX }}
          >
            <CodeLineRow
              segments={lineToSegments(line)}
              assignments={assignments}
              activeGapId={activeGapId}
              language={content.language}
              disabled={disabled}
              onUpdateGap={onUpdateGap}
              onFocusGap={onFocusGap}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
