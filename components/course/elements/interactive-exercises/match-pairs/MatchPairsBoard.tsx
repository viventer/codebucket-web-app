"use client";

import type { MatchPairsExerciseController } from "@/lib/exercises/types";

import { MatchPairItem } from "./MatchPairItem";

type MatchPairsBoardProps = {
  controller: MatchPairsExerciseController;
};

export function MatchPairsBoard({ controller }: MatchPairsBoardProps) {
  const {
    leftItems,
    rightItems,
    matchedPairIds,
    selectItem,
    getItemState,
    isErrorFlashing,
  } = controller;

  return (
    <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 sm:gap-8">
      <div className="flex flex-col gap-3">
        {leftItems.map((item) => (
          <MatchPairItem
            key={item.id}
            text={item.text}
            state={getItemState(item.id)}
            showErrorFlash={isErrorFlashing(item.id)}
            isDisabled={matchedPairIds.has(item.pairId)}
            mono
            onSelect={() => selectItem("left", item.id)}
          />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {rightItems.map((item) => (
          <MatchPairItem
            key={item.id}
            text={item.text}
            state={getItemState(item.id)}
            showErrorFlash={isErrorFlashing(item.id)}
            isDisabled={matchedPairIds.has(item.pairId)}
            onSelect={() => selectItem("right", item.id)}
          />
        ))}
      </div>
    </div>
  );
}
