"use client";

import { AnimatePresence, motion } from "motion/react";
import { useParams } from "next/navigation";

import { ExerciseFeedbackMessage } from "@/components/course/exercises/ExerciseFeedbackMessage";
import { useExerciseSession } from "@/lib/exercises/ExerciseSessionContext";
import type { MultiStageFillGapsContent } from "@/schemas/courseSchema";

import { FillGapsWorkspace } from "./FillGapsWorkspace";
import {
  StagePresentation,
  StagePreviewPanel,
  stageHasTopPresentation,
  stageUsesPreviewLayout,
} from "./multi-stage/StagePresentation";

type MultiStageFillGapsExerciseProps = {
  content: MultiStageFillGapsContent;
};

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

  const workspace = (
    <div className="flex flex-col gap-4 sm:gap-8">
      <FillGapsWorkspace
        language={currentStage.language}
        lines={currentStage.lines}
        assignments={assignments}
        activeGapId={activeGapId}
        availableOptions={availableOptions}
        selectOption={selectOption}
        clearGap={clearGap}
        setActiveGapId={setActiveGapId}
        showOptionsPool={!canProceed}
        isLocked={isLocked}
      />

      <ExerciseFeedbackMessage />
    </div>
  );

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
              {workspace}
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

              {workspace}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
