"use client";

import { CircleHelp } from "lucide-react";

import { ExerciseFeedbackMessage } from "@/components/course/exercises/ExerciseFeedbackMessage";
import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";
import type { FillGapsContent } from "@/schemas/courseSchema";

import { CodePanel } from "./fill-gaps/CodePanel";
import { OptionsPool } from "./fill-gaps/OptionsPool";

type FillGapsExerciseProps = {
  content: FillGapsContent;
};

export function FillGapsExercise({ content }: FillGapsExerciseProps) {
  const { controller, canProceed } = useExerciseSession();

  if (!controller || controller.kind !== "fillGaps") {
    return null;
  }

  const {
    assignments,
    activeGapId,
    availableOptions,
    selectOption,
    clearGap,
    setActiveGapId,
  } = controller;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <CircleHelp className="size-5 shrink-0 text-foreground" />
        <h3 className="text-base font-medium">{content.command}</h3>
      </div>

      <CodePanel
        content={content}
        assignments={assignments}
        activeGapId={activeGapId}
        onClearGap={clearGap}
        onSelectGap={setActiveGapId}
      />

      {!canProceed && (
        <OptionsPool
          options={availableOptions}
          onSelect={selectOption}
          disabled={!activeGapId}
        />
      )}

      <ExerciseFeedbackMessage />
    </div>
  );
}
