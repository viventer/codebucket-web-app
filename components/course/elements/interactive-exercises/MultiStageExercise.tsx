"use client";

import { AnimatePresence, motion } from "motion/react";
import { useParams } from "next/navigation";

import { ExerciseFeedbackMessage } from "@/components/course/exercises/ExerciseFeedbackMessage";
import { useExerciseSession } from "@/lib/exercises/session/ExerciseSessionContext";
import type { MultiStageContent } from "@/schemas/courseSchema";

import { FillGapsWorkspace } from "./FillGapsWorkspace";
import { MatchPairsBoard } from "./match-pairs/MatchPairsBoard";
import {
  StagePresentation,
  StagePreviewPanel,
  stageHasTopPresentation,
  stageUsesPreviewLayout,
} from "./multi-stage/StagePresentation";
import { SelectCorrectAnswers } from "./select-correct/SelectCorrectAnswers";

type MultiStageExerciseProps = {
  content: MultiStageContent;
};

export function MultiStageExercise({ content }: MultiStageExerciseProps) {
  const params = useParams<{ id: string }>();
  const courseId = params.id;
  const { controller, canProceed, isLocked } = useExerciseSession();

  if (!controller || controller.kind !== "multiStage") {
    return null;
  }

  const {
    currentStage,
    currentStageIndex,
    flowPhase,
    assignments,
    activeGapId,
    availableOptions,
    selectOption,
    clearGap,
    setActiveGapId,
    selectCorrectPersisted,
    shuffledSelectCorrectAnswers,
    selectAnswer,
    getAnswerVisualState,
    getWrongExplanation,
  } = controller;

  const stageCommand = currentStage.command ?? content.command;

  if (currentStage.type === "matchPairs") {
    return (
      <div className="flex flex-col gap-4 sm:gap-8">
        <h3 className="text-base font-medium">{stageCommand}</h3>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentStageIndex}-${flowPhase}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4 sm:gap-8"
          >
            <MatchPairsBoard controller={controller} />
            <ExerciseFeedbackMessage />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (currentStage.type === "selectCorrect") {
    const persisted = selectCorrectPersisted ?? {
      selectedAnswerId: null,
      phase: "idle" as const,
      attempt: "first" as const,
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentStageIndex}-${flowPhase}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-4 sm:gap-8"
        >
          <SelectCorrectAnswers
            question={currentStage.question}
            answers={shuffledSelectCorrectAnswers}
            prompt={currentStage.prompt}
            isLocked={persisted.selectedAnswerId !== null || isLocked}
            selectAnswer={selectAnswer}
            getAnswerVisualState={getAnswerVisualState}
            getWrongExplanation={getWrongExplanation}
            selectedAnswerId={persisted.selectedAnswerId}
            phase={persisted.phase}
            flowPhase={flowPhase as "first" | "retry"}
          />
          <ExerciseFeedbackMessage />
        </motion.div>
      </AnimatePresence>
    );
  }

  const presentation = currentStage.presentation ?? { kind: "code" as const };
  const hasTopPresentation = stageHasTopPresentation(presentation);
  const usesPreviewLayout = stageUsesPreviewLayout(presentation);
  const typography = currentStage.typography ?? "default";

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
        typography={typography}
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
              <StagePreviewPanel presentation={presentation} />
            </div>
          ) : (
            <>
              {hasTopPresentation && (
                <StagePresentation
                  courseId={courseId}
                  presentation={presentation}
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
