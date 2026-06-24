"use client";

import { HTMLPreview } from "@/components/html-preview/HTMLPreview";
import { ExerciseFeedbackMessage } from "@/components/course/exercises/ExerciseFeedbackMessage";
import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";
import type { FillCodeContent } from "@/schemas/courseSchema";

import { GapLinesPanel } from "./gap-lines/GapLinesPanel";

type FillCodeExerciseProps = {
  content: FillCodeContent;
};

export function FillCodeExercise({ content }: FillCodeExerciseProps) {
  const { controller } = useExerciseSession();

  if (!controller || controller.kind !== "fillCode") {
    return null;
  }

  const { assignments, activeGapId, updateGap, setActiveGapId } = controller;

  const codePanel = (
    <GapLinesPanel
      gapMode="input"
      language={content.language}
      lines={content.lines}
      assignments={assignments}
      activeGapId={activeGapId}
      onUpdateGap={updateGap}
      onFocusGap={setActiveGapId}
      className="max-w-[90vw]"
    />
  );

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <h3 className="text-base font-medium">{content.command}</h3>

      {content.previewHtml ? (
        <div className="grid gap-4 sm:gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4 sm:gap-8">{codePanel}</div>
          <HTMLPreview
            html={content.previewHtml}
            className="min-h-64 lg:min-h-80"
          />
        </div>
      ) : (
        codePanel
      )}

      <ExerciseFeedbackMessage />
    </div>
  );
}
