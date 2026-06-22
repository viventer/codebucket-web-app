import type { InteractiveExerciseType } from "@/schemas/courseSchema";

const TYPE_LABELS: Record<InteractiveExerciseType, string> = {
  fillGaps: "FillGaps",
  multiStageFillGaps: "MultiStageFillGaps",
  matchPairs: "MatchPairs",
  fillCode: "FillCode",
  selectCorrect: "SelectCorrect",
  custom: "Custom",
};

type ExerciseTypePlaceholderProps = {
  type: InteractiveExerciseType;
};

export function ExerciseTypePlaceholder({ type }: ExerciseTypePlaceholderProps) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
      {TYPE_LABELS[type]}
    </div>
  );
}
