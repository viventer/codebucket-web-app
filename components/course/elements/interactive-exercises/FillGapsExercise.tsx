"use client";

import { CircleHelp } from "lucide-react";

import type { FillGapsContent } from "@/schemas/courseSchema";

import { CodePanel } from "./fill-gaps/CodePanel";
import { OptionsPool } from "./fill-gaps/OptionsPool";
import { useFillGapsState } from "./fill-gaps/useFillGapsState";

type FillGapsExerciseProps = {
  content: FillGapsContent;
};

export function FillGapsExercise({ content }: FillGapsExerciseProps) {
  const {
    assignments,
    activeGapId,
    availableOptions,
    selectOption,
    clearGap,
    setActiveGapId,
  } = useFillGapsState(content);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <CircleHelp className="size-6 shrink-0 text-primary" />
        <h3 className="text-lg font-medium">{content.command}</h3>
      </div>

      <CodePanel
        content={content}
        assignments={assignments}
        activeGapId={activeGapId}
        onClearGap={clearGap}
        onSelectGap={setActiveGapId}
      />

      <OptionsPool
        options={availableOptions}
        onSelect={selectOption}
        disabled={!activeGapId}
      />
    </div>
  );
}
