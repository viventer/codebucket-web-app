"use client";

import { HTMLPreview } from "@/components/html-preview/HTMLPreview";
import type { SelectCorrectPrompt } from "@/schemas/courseSchema";

import { StaticCodePanel } from "../gap-lines/StaticCodePanel";
import { StageImageDiagram } from "../interactive/StageImageDiagram";

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
      <StaticCodePanel
        code={prompt.code}
        language={prompt.language}
        className="max-w-[90vw]"
      />
    );
  }

  return null;
}
