import type { CourseElement } from "@/schemas/courseSchema";

import { BackNextActions } from "./BackNextActions";
import { CheatsheetActions } from "./CheatsheetActions";
import { CourseEndingActions } from "./CourseEndingActions";
import { GuidedProjectActions } from "./GuidedProjectActions";
import { InteractiveExerciseActions } from "./InteractiveExerciseActions";
import { LocalCodeExerciseActions } from "./LocalCodeExerciseActions";
import { ProjectActions } from "./ProjectActions";
import type { ElementActionsProps } from "./types";

function renderActions(
  type: CourseElement["type"],
  prevHref: string | null,
  nextHref: string | null,
  continueHref: string | null,
  hasMaterials: boolean,
  hasHint?: boolean,
) {
  switch (type) {
    case "video":
    case "interactiveDemo":
      return <BackNextActions prevHref={prevHref} nextHref={nextHref} />;
    case "cheatsheet":
      return <CheatsheetActions prevHref={prevHref} nextHref={nextHref} />;
    case "courseEnding":
      return (
        <CourseEndingActions prevHref={prevHref} continueHref={continueHref} />
      );
    case "guidedProject":
      return (
        <GuidedProjectActions
          prevHref={prevHref}
          nextHref={nextHref}
          hasMaterials={hasMaterials}
        />
      );
    case "individualProject":
      return <ProjectActions nextHref={nextHref} hasMaterials={hasMaterials} />;
    case "localCodeExercise":
      return (
        <LocalCodeExerciseActions
          prevHref={prevHref}
          nextHref={nextHref}
          hasMaterials={hasMaterials}
          hasHint={hasHint}
        />
      );
    case "platformCodeExercise":
    case "interactiveExercise":
    case "customExercise":
      return (
        <InteractiveExerciseActions
          prevHref={prevHref}
          nextHref={nextHref}
          hasHint={hasHint}
        />
      );
  }
}

export function Actions({
  type,
  prevHref,
  nextHref,
  continueHref,
  hasMaterials,
  hasHint,
}: ElementActionsProps) {
  return renderActions(
    type,
    prevHref,
    nextHref,
    continueHref ?? null,
    hasMaterials,
    hasHint,
  );
}
