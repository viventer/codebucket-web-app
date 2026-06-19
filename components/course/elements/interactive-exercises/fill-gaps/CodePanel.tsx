"use client";

import type { FillGapsContent } from "@/schemas/courseSchema";

import { GapSlot } from "./GapSlot";
import { getClosingTag } from "./getClosingTag";
import { HighlightedCode } from "./HighlightedCode";
import { Card, CardContent } from "@/components/ui/card";

const INDENT_PX = 24;

type CodePanelProps = {
  content: FillGapsContent;
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  onClearGap: (gapId: string) => void;
  onSelectGap: (gapId: string) => void;
  disabled?: boolean;
};

export function CodePanel({
  content,
  assignments,
  activeGapId,
  onClearGap,
  onSelectGap,
  disabled = false,
}: CodePanelProps) {
  return (
    <Card className="font-mono text-sm leading-10">
      <CardContent>
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
              <div key={line.id} style={style}>
                <GapSlot
                  value={assignments[line.id] ?? null}
                  isActive={!disabled && activeGapId === line.id}
                  onSelect={disabled ? undefined : () => onSelectGap(line.id)}
                  onClear={disabled ? undefined : () => onClearGap(line.id)}
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
