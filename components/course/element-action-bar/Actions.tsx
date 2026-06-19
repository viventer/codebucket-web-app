import type { CourseElement } from "@/schemas/courseSchema";

import { BackNextActions } from "./BackNextActions";
import { DownloadMaterialsButton } from "./DownloadMaterialsButton";
import { ExerciseActions } from "./ExerciseActions";
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
      return <ExerciseActions nextHref={nextHref} hasHint={hasHint} />;
    case "quiz":
      return (
        <PlaceholderButton variant="ghost">Następne pytanie</PlaceholderButton>
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
  return (
    <div className="flex shrink-0 items-center gap-2">
      {renderActions(type, prevHref, nextHref, hasMaterials, hasHint)}
    </div>
  );
}
