import type { CourseElement } from "@/schemas/courseSchema";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

import { ELEMENT_TYPE_ICONS } from "./element-type-icons";

type ElementInfoProps = {
  type: CourseElement["type"];
  title: string;
  hideOnMobile?: boolean;
};

export function ElementInfo({
  type,
  title,
  hideOnMobile = false,
}: ElementInfoProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",
        hideOnMobile && "hidden sm:flex",
      )}
    >
      <Icon
        src={ELEMENT_TYPE_ICONS[type]}
        size={20}
        className="shrink-0 text-primary"
      />
      <p className="truncate text-sm font-medium text-foreground">{title}</p>
    </div>
  );
}
