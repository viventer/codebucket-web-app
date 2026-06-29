"use client";

import { HTMLPreview } from "@/components/html-preview/HTMLPreview";
import type { ExerciseStagePresentation } from "@/schemas/courseSchema";

import { StageImageDiagram } from "./StageImageDiagram";

type StagePresentationProps = {
  presentation: ExerciseStagePresentation;
  assetUrls: Record<string, string>;
};

export function StagePresentation({
  presentation,
  assetUrls,
}: StagePresentationProps) {
  if (presentation.kind === "image") {
    const src = assetUrls[presentation.imageSrc];
    if (!src) return null;

    return <StageImageDiagram src={src} />;
  }

  return null;
}

export function StagePreviewPanel({
  presentation,
}: {
  presentation: ExerciseStagePresentation;
}) {
  if (presentation.kind !== "preview") {
    return null;
  }

  return (
    <HTMLPreview
      html={presentation.previewHtml}
      className="min-h-64 lg:min-h-80"
    />
  );
}

export function stageHasTopPresentation(
  presentation: ExerciseStagePresentation,
): boolean {
  return presentation.kind === "image";
}

export function stageUsesPreviewLayout(
  presentation: ExerciseStagePresentation,
): boolean {
  return presentation.kind === "preview";
}
