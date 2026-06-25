"use client";

import { cn } from "@/lib/utils";
import type { FillGapsLine, Language } from "@/schemas/courseSchema";

import { GapLinesPanel } from "./gap-lines/GapLinesPanel";
import { OptionsPool } from "./fill-gaps/OptionsPool";

type FillGapsWorkspaceProps = {
  language: Language;
  lines: FillGapsLine[];
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  availableOptions: string[];
  selectOption: (option: string) => void;
  clearGap: (gapId: string) => void;
  setActiveGapId: (gapId: string | null) => void;
  showOptionsPool: boolean;
  isLocked?: boolean;
  typography?: "default" | "large";
};

export function FillGapsWorkspace({
  language,
  lines,
  assignments,
  activeGapId,
  availableOptions,
  selectOption,
  clearGap,
  setActiveGapId,
  showOptionsPool,
  isLocked,
  typography = "default",
}: FillGapsWorkspaceProps) {
  const isLarge = typography === "large";

  return (
    <>
      <GapLinesPanel
        gapMode="select"
        language={language}
        lines={lines}
        assignments={assignments}
        activeGapId={activeGapId}
        onSelectGap={setActiveGapId}
        onClearGap={clearGap}
        isLocked={isLocked}
        typography={typography}
      />

      {showOptionsPool && (
        <div
          className={cn(
            isLarge && "font-mono text-xl sm:text-2xl [&_button]:h-auto [&_button]:px-4 [&_button]:py-2",
          )}
        >
          <OptionsPool
            options={availableOptions}
            onSelect={selectOption}
            disabled={!activeGapId}
          />
        </div>
      )}
    </>
  );
}
