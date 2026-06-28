"use client";

import { RotateCcwIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { ExerciseFeedbackMessage } from "@/components/course/exercises/ExerciseFeedbackMessage";
import {
  getChooseMatchingGridColumns,
  type ChooseMatchingItemVisualState,
} from "@/lib/exercises/choose-matching/choose-matching-state";
import type { InteractiveExerciseFlowPhase } from "@/lib/exercises/shared/types";

import { ChooseMatchingItemButton } from "./ChooseMatchingItemButton";

type ChooseMatchingGridProps = {
  command: string;
  items: { id: number; content: string }[];
  flowPhase: InteractiveExerciseFlowPhase;
  isLocked: boolean;
  toggleItem: (itemId: number) => void;
  getItemVisualState: (itemId: number) => ChooseMatchingItemVisualState;
};

export function ChooseMatchingGrid({
  command,
  items,
  flowPhase,
  isLocked,
  toggleItem,
  getItemVisualState,
}: ChooseMatchingGridProps) {
  const columns = getChooseMatchingGridColumns(items.length);

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <div className="flex flex-col gap-2">
        {flowPhase === "retry" && (
          <div className="flex items-center gap-2 text-sm font-light text-feedback-warning">
            <RotateCcwIcon className="size-4" />
            <p>Ponowna próba</p>
          </div>
        )}

        <h3 className="text-base font-medium">{command}</h3>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-4 sm:gap-8"
        >
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {items.map((item) => (
              <ChooseMatchingItemButton
                key={item.id}
                content={item.content}
                visualState={getItemVisualState(item.id)}
                disabled={isLocked}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>

          <ExerciseFeedbackMessage />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
