"use client";

import { HTMLPreview } from "@/components/html-preview/HTMLPreview";
import type { MultiStageStagePresentation } from "@/schemas/courseSchema";

import { StageImageDiagram } from "./StageImageDiagram";

type StagePresentationProps = {
  courseId: string;
  presentation: MultiStageStagePresentation;
};

export function StagePresentation({
  courseId,
  presentation,
}: StagePresentationProps) {
  if (presentation.kind === "image") {
    return (
      <StageImageDiagram courseId={courseId} imageSrc={presentation.imageSrc} />
    );
  }

  return null;
}

export function StagePreviewPanel({
  presentation,
}: {
  presentation: MultiStageStagePresentation;
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
  presentation: MultiStageStagePresentation,
): boolean {
  return presentation.kind === "image";
}

export function stageUsesPreviewLayout(
  presentation: MultiStageStagePresentation,
): boolean {
  return presentation.kind === "preview";
}
