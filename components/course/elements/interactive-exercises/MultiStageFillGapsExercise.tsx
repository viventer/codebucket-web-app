"use client";

import { AnimatePresence, motion } from "motion/react";
import { useParams } from "next/navigation";

import { ExerciseFeedbackMessage } from "@/components/course/exercises/ExerciseFeedbackMessage";
import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";
import type { MultiStageFillGapsContent } from "@/schemas/courseSchema";

import { CodePanel } from "./fill-gaps/CodePanel";
import { OptionsPool } from "./fill-gaps/OptionsPool";
import {
  StagePresentation,
  StagePreviewPanel,
  stageHasTopPresentation,
  stageUsesPreviewLayout,
} from "./multi-stage/StagePresentation";

type MultiStageFillGapsExerciseProps = {
  content: MultiStageFillGapsContent;
};

function FillGapsWorkspace({
  stage,
  assignments,
  activeGapId,
  availableOptions,
  selectOption,
  clearGap,
  setActiveGapId,
  showOptionsPool,
  isLocked,
}: {
  stage: MultiStageFillGapsContent["stages"][number];
  assignments: Record<string, string | null>;
  activeGapId: string | null;
  availableOptions: string[];
  selectOption: (option: string) => void;
  clearGap: (gapId: string) => void;
  setActiveGapId: (gapId: string | null) => void;
  showOptionsPool: boolean;
  isLocked: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <CodePanel
        content={stage}
        assignments={assignments}
        activeGapId={activeGapId}
        onClearGap={clearGap}
        onSelectGap={setActiveGapId}
        isLocked={isLocked}
      />

      <ExerciseFeedbackMessage />

      {showOptionsPool && (
        <OptionsPool
          options={availableOptions}
          onSelect={selectOption}
          disabled={!activeGapId}
        />
      )}
    </div>
  );
}

export function MultiStageFillGapsExercise({
  content,
}: MultiStageFillGapsExerciseProps) {
  const params = useParams<{ id: string }>();
  const courseId = params.id;
  const { controller, canProceed, isLocked } = useExerciseSession();

  if (!controller || controller.kind !== "multiStageFillGaps") {
    return null;
  }

  const {
    currentStage,
    currentStageIndex,
    assignments,
    activeGapId,
    availableOptions,
    selectOption,
    clearGap,
    setActiveGapId,
  } = controller;

  const stageCommand = currentStage.command ?? content.command;
  const hasTopPresentation = stageHasTopPresentation(currentStage.presentation);
  const usesPreviewLayout = stageUsesPreviewLayout(currentStage.presentation);

  const workspaceProps = {
    stage: currentStage,
    assignments,
    activeGapId,
    availableOptions,
    selectOption,
    clearGap,
    setActiveGapId,
    showOptionsPool: !canProceed,
    isLocked,
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <h3 className="text-base font-medium">{stageCommand}</h3>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStageIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-4 sm:gap-8"
        >
          {usesPreviewLayout ? (
            <div className="grid gap-4 sm:gap-8 lg:grid-cols-2">
              <FillGapsWorkspace {...workspaceProps} />
              <StagePreviewPanel presentation={currentStage.presentation} />
            </div>
          ) : (
            <>
              {hasTopPresentation && (
                <StagePresentation
                  courseId={courseId}
                  presentation={currentStage.presentation}
                />
              )}

              <FillGapsWorkspace {...workspaceProps} />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
