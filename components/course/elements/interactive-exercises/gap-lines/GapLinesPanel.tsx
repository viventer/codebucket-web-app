"use client";

import { useExerciseSessionOptional } from "@/lib/exercises/ExerciseSessionContext";
import { itemGlowStyleFromExerciseFeedback } from "@/lib/exercises/item-glow-style";
import type { GapLinesContent } from "@/lib/exercises/fill-gaps-utils";
import { cn } from "@/lib/utils";
import type { FillGapsLine, Language } from "@/schemas/courseSchema";

import { Card, CardContent } from "@/components/ui/card";

import { CodeLineRow, type CodeLineRowProps } from "./CodeLineRow";
import { getLineKey, lineToSegments } from "./line-segments";

const INDENT_PX = 24;

type GapLinesPanelBaseProps = {
  language: Language;
  lines: FillGapsLine[];
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  showFeedbackGlow?: boolean;
  isLocked?: boolean;
  className?: string;
};

export type GapLinesPanelProps = GapLinesPanelBaseProps &
  (
    | Pick<
        CodeLineRowProps & { gapMode: "input" },
        "gapMode" | "onUpdateGap" | "onFocusGap"
      >
    | Pick<
        CodeLineRowProps & { gapMode: "select" },
        "gapMode" | "onSelectGap" | "onClearGap"
      >
  );

export function GapLinesPanel({
  language,
  lines,
  assignments,
  activeGapId,
  showFeedbackGlow = true,
  isLocked: isLockedProp,
  className,
  ...gapProps
}: GapLinesPanelProps) {
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
        "font-mono text-sm transition-shadow duration-300 bg-card/30 overflow-auto max-w-[90vw]",
        disabled && "pointer-events-none select-none opacity-80",
        className,
      )}
      style={glowStyle}
    >
      <CardContent className="flex flex-col gap-4">
        {lines.map((line, index) => (
          <div
            key={getLineKey(line, index)}
            style={{ paddingLeft: line.indent * INDENT_PX }}
          >
            <CodeLineRow
              segments={lineToSegments(line)}
              assignments={assignments}
              activeGapId={activeGapId}
              language={language}
              disabled={disabled}
              {...gapProps}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export type GapLinesPanelContent = GapLinesContent;
