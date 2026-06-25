"use client";

import { HTMLPreview } from "@/components/html-preview/HTMLPreview";
import type { SelectCorrectPrompt } from "@/schemas/courseSchema";
import { cn } from "@/lib/utils";

import { StageImageDiagram } from "../multi-stage/StageImageDiagram";

type SelectCorrectPromptProps = {
  courseId?: string;
  prompt: SelectCorrectPrompt;
};

export function SelectCorrectPromptContent({
  courseId,
  prompt,
}: SelectCorrectPromptProps) {
  if (prompt.kind === "image" && courseId) {
    return <StageImageDiagram courseId={courseId} imageSrc={prompt.imageSrc} />;
  }

  if (prompt.kind === "preview") {
    return (
      <HTMLPreview html={prompt.previewHtml} className="min-h-48 w-full" />
    );
  }

  if (prompt.kind === "code") {
    return (
      <pre
        className={cn(
          "overflow-auto rounded-lg border bg-card/30 p-4 font-mono text-sm",
        )}
      >
        <code>{prompt.code}</code>
      </pre>
    );
  }

  return null;
}
