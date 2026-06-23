"use client";

import { HTMLPreview } from "@/components/HTMLPreview";
import { ExerciseFeedbackMessage } from "@/components/course/exercises/ExerciseFeedbackMessage";
import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";
import type { FillCodeContent } from "@/schemas/courseSchema";

import { FillCodeCodePanel } from "./fill-code/FillCodeCodePanel";

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
    <FillCodeCodePanel
      content={content}
      assignments={assignments}
      activeGapId={activeGapId}
      onUpdateGap={updateGap}
      onFocusGap={setActiveGapId}
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
