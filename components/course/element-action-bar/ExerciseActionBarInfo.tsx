"use client";

import type { CourseElement } from "@/schemas/courseSchema";
import { cn } from "@/lib/utils";
import { useExerciseSessionOptional } from "@/lib/exercises/ExerciseSessionContext";

import { ELEMENT_TYPE_ICONS } from "./element-type-icons";

type ExerciseActionBarInfoProps = {
  type: CourseElement["type"];
  title: string;
  hideOnMobile?: boolean;
};

export function ExerciseActionBarInfo({
  type,
  title,
  hideOnMobile = false,
}: ExerciseActionBarInfoProps) {
  const session = useExerciseSessionOptional();
  const Icon = ELEMENT_TYPE_ICONS[type];
  const stageProgress = session?.stageProgress;

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",
        hideOnMobile && "hidden sm:flex",
      )}
    >
      <Icon className="size-5 shrink-0 text-primary" />
      <p className="truncate text-sm font-medium text-foreground">{title}</p>
      {stageProgress && (
        <span className="hidden shrink-0 text-sm text-muted-foreground sm:inline">
          {stageProgress.current}/{stageProgress.total}
        </span>
      )}
    </div>
  );
}
