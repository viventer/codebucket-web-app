import type { CustomExerciseContent } from "@/schemas/courseSchema";

export function CustomExerciseElement({
  content,
}: {
  content: CustomExerciseContent;
}) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
      CustomExercise: {content.component}
    </div>
  );
}
