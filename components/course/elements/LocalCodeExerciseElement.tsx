"use client";

import { HTMLPreview } from "@/components/html-preview/HTMLPreview";
import { Card, CardContent } from "@/components/ui/card";
import { useExerciseSession } from "@/lib/exercises/session/ExerciseSessionContext";
import type { LocalCodeExerciseContent } from "@/schemas/courseSchema";
import { cn } from "@/lib/utils";

const COMPLETED_COMMAND = "Porównaj swoje rozwiązanie z przykładowym.";
const COMPLETED_NOTE =
  "Twoje rozwiązanie może różnić się od tego poniżej. To nie jest twój błąd, tą samą stronę można wykonać na wiele różnych sposobów.";

function getHtmlSnippet(content: LocalCodeExerciseContent): string | null {
  const htmlSnippet = content.solutionCode.find(
    (snippet) => snippet.language === "html",
  );
  return htmlSnippet?.code ?? null;
}

export function LocalCodeExerciseElement({
  content,
}: {
  content: LocalCodeExerciseContent;
}) {
  const { localPhase } = useExerciseSession();
  const html = getHtmlSnippet(content);
  const isCompleted = localPhase === "completed";

  if (!html) {
    return null;
  }

  return (
    <div className="flex h-full min-h-[calc(100vh-12rem)] flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-medium">
          {isCompleted ? COMPLETED_COMMAND : content.command}
        </h3>
        {isCompleted && (
          <p className="text-sm text-muted-foreground">{COMPLETED_NOTE}</p>
        )}
      </div>

      {isCompleted ? (
        <Card
          className={cn(
            "min-h-0 flex-1 overflow-hidden ring-2 ring-green-500/50",
            "shadow-[0_0_24px_rgba(34,197,94,0.35)]",
          )}
        >
          <CardContent className="h-full max-h-[calc(100vh-16rem)] overflow-auto p-0">
            <pre className="p-4 text-sm">
              <code>{html}</code>
            </pre>
          </CardContent>
        </Card>
      ) : (
        <HTMLPreview
          html={html}
          className="min-h-0 flex-1"
          title="Podgląd strony docelowej"
        />
      )}
    </div>
  );
}
