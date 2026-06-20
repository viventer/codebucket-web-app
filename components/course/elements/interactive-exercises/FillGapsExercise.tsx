"use client";

import { HTMLPreview } from "@/components/HTMLPreview";
import { ExerciseFeedbackMessage } from "@/components/course/exercises/ExerciseFeedbackMessage";
import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";
import type { FillGapsContent } from "@/schemas/courseSchema";

import { CodePanel } from "./fill-gaps/CodePanel";
import { OptionsPool } from "./fill-gaps/OptionsPool";

type FillGapsExerciseProps = {
  content: FillGapsContent;
};

function FillGapsWorkspace({
  content,
  assignments,
  activeGapId,
  availableOptions,
  selectOption,
  clearGap,
  setActiveGapId,
  showOptionsPool,
}: {
  content: FillGapsContent;
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  availableOptions: string[];
  selectOption: (option: string) => void;
  clearGap: (gapId: string) => void;
  setActiveGapId: (gapId: string | null) => void;
  showOptionsPool: boolean;
}) {
  return (
    <>
      <CodePanel
        content={content}
        assignments={assignments}
        activeGapId={activeGapId}
        onClearGap={clearGap}
        onSelectGap={setActiveGapId}
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

  const workspaceProps = {
    content,
    assignments,
    activeGapId,
    availableOptions,
    selectOption,
    clearGap,
    setActiveGapId,
    showOptionsPool: !canProceed,
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <h3 className="text-base font-medium">{content.command}</h3>

      {content.previewHtml ? (
        <div className="grid gap-4 sm:gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4 sm:gap-8">
            <FillGapsWorkspace {...workspaceProps} />
          </div>
          <HTMLPreview html={content.previewHtml} className="min-h-64 lg:min-h-80" />
        </div>
      ) : (
        <FillGapsWorkspace {...workspaceProps} />
      )}

      <ExerciseFeedbackMessage />
    </div>
  );
}
