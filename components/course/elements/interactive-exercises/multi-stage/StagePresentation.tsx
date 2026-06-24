"use client";

import { HTMLPreview } from "@/components/html-preview/HTMLPreview";
import type { MultiStageFillGapsStagePresentation } from "@/schemas/courseSchema";

import { StageImageDiagram } from "./StageImageDiagram";

type StagePresentationProps = {
  courseId: string;
  presentation: MultiStageFillGapsStagePresentation;
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
  presentation: MultiStageFillGapsStagePresentation;
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
  presentation: MultiStageFillGapsStagePresentation,
): boolean {
  return presentation.kind === "image";
}

export function stageUsesPreviewLayout(
  presentation: MultiStageFillGapsStagePresentation,
): boolean {
  return presentation.kind === "preview";
}
