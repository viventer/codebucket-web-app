"use client";

import { AnimatePresence, motion } from "motion/react";
import { useParams } from "next/navigation";

import { ExerciseFeedbackMessage } from "@/components/course/exercises/ExerciseFeedbackMessage";
import { useExerciseSession } from "@/lib/exercises/session/ExerciseSessionContext";
import type { MultiStageContent } from "@/schemas/courseSchema";

import { FillGapsWorkspace } from "./FillGapsWorkspace";
import { GapLinesPanel } from "./gap-lines/GapLinesPanel";
import { MatchPairsBoard } from "./match-pairs/MatchPairsBoard";
import {
  StagePresentation,
  StagePreviewPanel,
  stageHasTopPresentation,
  stageUsesPreviewLayout,
} from "./multi-stage/StagePresentation";
import { SelectCorrectAnswers } from "./select-correct/SelectCorrectAnswers";
import { ChooseMatchingGrid } from "./choose-matching/ChooseMatchingGrid";

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

  const { navigation, stage } = controller;
  const { currentStage, currentStageIndex, flowPhase } = navigation;
  const stageCommand = currentStage.command ?? content.command;

  if (stage.type === "matchPairs") {
    const { type: _, ...matchPairsController } = stage;

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
            <MatchPairsBoard controller={matchPairsController} />
            <ExerciseFeedbackMessage />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (stage.type === "selectCorrect") {
    const persisted = stage.persisted;

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
            question={stage.question}
            answers={stage.shuffledAnswers}
            prompt={stage.prompt}
            isLocked={persisted.selectedAnswerId !== null || isLocked}
            selectAnswer={stage.selectAnswer}
            getAnswerVisualState={stage.getAnswerVisualState}
            getWrongExplanation={stage.getWrongExplanation}
            selectedAnswerId={persisted.selectedAnswerId}
            phase={persisted.phase}
            flowPhase={flowPhase === "retry" ? "retry" : "first"}
          />
          <ExerciseFeedbackMessage />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (stage.type === "chooseMatching") {
    const persisted = stage.persisted;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentStageIndex}-${flowPhase}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <ChooseMatchingGrid
            command={stage.command}
            items={stage.shuffledItems}
            flowPhase={flowPhase}
            isLocked={persisted.phase !== "idle" || isLocked}
            toggleItem={stage.toggleItem}
            getItemVisualState={stage.getItemVisualState}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (stage.type === "fillCode" && currentStage.type === "fillCode") {
    const presentation = currentStage.presentation ?? { kind: "code" as const };
    const usesPreviewLayout = stageUsesPreviewLayout(presentation);
    const typography = currentStage.typography ?? "default";

    const codePanel = (
      <GapLinesPanel
        gapMode="input"
        language={currentStage.language}
        lines={currentStage.lines}
        assignments={stage.assignments}
        activeGapId={stage.activeGapId}
        onUpdateGap={stage.updateGap}
        onFocusGap={stage.setActiveGapId}
        typography={typography}
        className="max-w-[90vw]"
      />
    );

    const workspace = (
      <div className="flex flex-col gap-4 sm:gap-8">
        {codePanel}
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
              workspace
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (stage.type !== "fillGaps" || currentStage.type !== "fillGaps") {
    return null;
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
        assignments={stage.assignments}
        activeGapId={stage.activeGapId}
        availableOptions={stage.availableOptions}
        selectOption={stage.selectOption}
        clearGap={stage.clearGap}
        setActiveGapId={stage.setActiveGapId}
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
