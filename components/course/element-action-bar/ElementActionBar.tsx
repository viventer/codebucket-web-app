"use client";

import { cn } from "@/lib/utils";

import { Actions } from "./Actions";
import {
  AnimatedActionBarShell,
  useActionBarContentKeys,
} from "./AnimatedActionBarShell";
import { ExerciseActionBarInfo } from "./ExerciseActionBarInfo";
import type { ElementActionBarProps } from "./types";

export function ElementActionBar({
  type,
  title,
  sectionOrder,
  sectionTitle,
  hideInfoOnMobile = false,
  prevHref,
  nextHref,
  continueHref = null,
  hasMaterials,
  hasHint,
}: ElementActionBarProps) {
  const { infoKey, actionsKey } = useActionBarContentKeys(type, title);

  return (
    <AnimatedActionBarShell
      infoKey={infoKey}
      actionsKey={actionsKey}
      hideInfoOnMobile={hideInfoOnMobile}
      info={
        <ExerciseActionBarInfo
          type={type}
          title={title}
          sectionOrder={sectionOrder}
          sectionTitle={sectionTitle}
          hideOnMobile={hideInfoOnMobile}
        />
      }
      actions={
        <div
          className={cn(
            "flex w-fit flex-1 items-center justify-end gap-2 sm:justify-start",
            hideInfoOnMobile && "w-full sm:w-fit",
          )}
        >
          <Actions
            type={type}
            prevHref={prevHref}
            nextHref={nextHref}
            continueHref={continueHref}
            hasMaterials={hasMaterials}
            hasHint={hasHint}
          />
        </div>
      }
    />
  );
}
