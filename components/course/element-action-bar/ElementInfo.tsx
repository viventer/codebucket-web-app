import type { CourseElement } from "@/schemas/courseSchema";
import { cn } from "@/lib/utils";

import { ELEMENT_TYPE_ICONS } from "./element-type-icons";

type ElementInfoProps = {
  type: CourseElement["type"];
  title: string;
};

export function ElementInfo({ type, title }: ElementInfoProps) {
  const Icon = ELEMENT_TYPE_ICONS[type];
  const hideOnMobile = type === "interactiveExercise";

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",
        hideOnMobile && "hidden sm:flex",
      )}
    >
      <Icon className="size-5 shrink-0 text-primary" />
      <p className="truncate text-sm font-medium text-foreground">{title}</p>
    </div>
  );
}
