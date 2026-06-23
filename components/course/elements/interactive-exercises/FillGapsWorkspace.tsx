"use client";

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
}: FillGapsWorkspaceProps) {
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
      />

      {showOptionsPool && (
        <OptionsPool
          options={availableOptions}
          onSelect={selectOption}
          disabled={!activeGapId}
        />
      )}
    </>
  );
}
