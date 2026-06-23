import { ChevronRightIcon } from "lucide-react";

import type { CourseElement } from "@/schemas/courseSchema";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
import { BackNextActions } from "./BackNextActions";
import { DownloadMaterialsButton } from "./DownloadMaterialsButton";
import { InteractiveExerciseActions } from "./InteractiveExerciseActions";
import { PlaceholderButton } from "./PlaceholderButton";
import { ProjectActions } from "./ProjectActions";
import type { ElementActionsProps } from "./types";

function renderActions(
  type: CourseElement["type"],
  prevHref: string | null,
  nextHref: string | null,
  hasMaterials: boolean,
  hasHint?: boolean,
) {
  switch (type) {
    case "video":
    case "interactiveDemo":
      return <BackNextActions prevHref={prevHref} nextHref={nextHref} />;
    case "guidedProject":
      return (
        <>
          <BackNextActions prevHref={prevHref} nextHref={nextHref} />
          {hasMaterials && <DownloadMaterialsButton />}
        </>
      );
    case "individualProject":
      return <ProjectActions nextHref={nextHref} hasMaterials={hasMaterials} />;
    case "codeExercise":
    case "interactiveExercise":
      return (
        <InteractiveExerciseActions
          prevHref={prevHref}
          nextHref={nextHref}
          hasHint={hasHint}
        />
      );
    case "quiz":
      return (
        <PlaceholderButton variant="ghost">
          <ActionBarButtonLabel
            label="Następne pytanie"
            icon={ChevronRightIcon}
          />
        </PlaceholderButton>
      );
  }
}

export function Actions({
  type,
  prevHref,
  nextHref,
  hasMaterials,
  hasHint,
}: ElementActionsProps) {
  return renderActions(type, prevHref, nextHref, hasMaterials, hasHint);
}
