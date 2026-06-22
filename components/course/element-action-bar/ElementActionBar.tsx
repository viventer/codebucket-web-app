"use client";

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
  hasMaterials,
  hasHint,
}: ElementActionBarProps) {
  const { infoKey, actionsKey } = useActionBarContentKeys(type, title);

  return (
    <AnimatedActionBarShell
      infoKey={infoKey}
      actionsKey={actionsKey}
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
        <div className="flex w-fit flex-1 items-center justify-end gap-2 sm:justify-start">
          <Actions
            type={type}
            prevHref={prevHref}
            nextHref={nextHref}
            hasMaterials={hasMaterials}
            hasHint={hasHint}
          />
        </div>
      }
    />
  );
}
