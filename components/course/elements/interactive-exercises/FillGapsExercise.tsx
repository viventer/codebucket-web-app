"use client";

import { HTMLPreview } from "@/components/HTMLPreview";
import { ExerciseFeedbackMessage } from "@/components/course/exercises/ExerciseFeedbackMessage";
import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";
import type { FillGapsContent } from "@/schemas/courseSchema";

import { FillGapsWorkspace } from "./FillGapsWorkspace";

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

  const workspace = (
    <FillGapsWorkspace
      language={content.language}
      lines={content.lines}
      assignments={assignments}
      activeGapId={activeGapId}
      availableOptions={availableOptions}
      selectOption={selectOption}
      clearGap={clearGap}
      setActiveGapId={setActiveGapId}
      showOptionsPool={!canProceed}
    />
  );

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <h3 className="text-base font-medium">{content.command}</h3>

      {content.previewHtml ? (
        <div className="grid gap-4 sm:gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4 sm:gap-8">{workspace}</div>
          <HTMLPreview html={content.previewHtml} className="min-h-64 lg:min-h-80" />
        </div>
      ) : (
        workspace
      )}

      <ExerciseFeedbackMessage />
    </div>
  );
}
