import type { InteractiveExerciseContent } from "@/schemas/courseSchema";

import { ExerciseTypePlaceholder } from "./interactive-exercises/ExerciseTypePlaceholder";
import { FillGapsExercise } from "./interactive-exercises/FillGapsExercise";

export function InteractiveExerciseElement({
  content,
}: {
  content: InteractiveExerciseContent;
}) {
  switch (content.type) {
    case "fillGaps":
      return <FillGapsExercise content={content} />;
    default:
      return <ExerciseTypePlaceholder type={content.type} />;
  }
}
