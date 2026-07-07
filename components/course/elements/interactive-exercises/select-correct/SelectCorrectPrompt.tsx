"use client";

import { HTMLPreview } from "@/components/html-preview/HTMLPreview";
import type { SelectCorrectPrompt } from "@/schemas/exerciseSchema";

import { StaticCodePanel } from "../gap-lines/StaticCodePanel";
import { StageImageDiagram } from "../interactive/StageImageDiagram";

type SelectCorrectPromptProps = {
  prompt: SelectCorrectPrompt;
  assetUrls: Record<string, string>;
};

export function SelectCorrectPromptContent({
  prompt,
  assetUrls,
}: SelectCorrectPromptProps) {
  if (prompt.kind === "image") {
    const src = assetUrls[prompt.imageSrc];
    if (!src) return null;

    return <StageImageDiagram src={src} />;
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
