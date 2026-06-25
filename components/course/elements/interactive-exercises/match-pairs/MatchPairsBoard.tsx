"use client";

import type { MatchPairsExerciseController } from "@/lib/exercises/shared/types";

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
    <div className="mx-auto grid w-full grid-cols-2 items-stretch gap-x-4 gap-y-3 sm:gap-y-6 sm:gap-x-8">
      {leftItems.map((leftItem, index) => {
        const rightItem = rightItems[index];
        if (!rightItem) {
          return null;
        }

        return (
          <div key={leftItem.pairId} className="contents">
            <MatchPairItem
              text={leftItem.text}
              state={getItemState(leftItem.id)}
              showErrorFlash={isErrorFlashing(leftItem.id)}
              isDisabled={matchedPairIds.has(leftItem.pairId)}
              mono
              onSelect={() => selectItem("left", leftItem.id)}
            />
            <MatchPairItem
              text={rightItem.text}
              state={getItemState(rightItem.id)}
              showErrorFlash={isErrorFlashing(rightItem.id)}
              isDisabled={matchedPairIds.has(rightItem.pairId)}
              onSelect={() => selectItem("right", rightItem.id)}
            />
          </div>
        );
      })}
    </div>
  );
}
