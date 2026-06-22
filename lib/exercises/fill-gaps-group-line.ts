import type { FillGapsLine } from "@/schemas/courseSchema";

import { getClosingTag } from "@/lib/exercises/fill-gaps-utils";

export type GroupLineSegment = Extract<
  FillGapsLine,
  { kind: "group" }
>["segments"][number];

export type GroupLineBuildPart =
  | { kind: "text"; value: string }
  | { kind: "gap"; id: string };

/** Single-char placeholder kept inside Monaco string tokens during colorize. */
export const GAP_COLORIZE_PLACEHOLDER = "\uE002";

export function buildGroupLineParts(
  segments: GroupLineSegment[],
  assignments: Record<string, string | null>,
): GroupLineBuildPart[] {
  const parts: GroupLineBuildPart[] = [];

  for (const segment of segments) {
    if (segment.kind === "text") {
      parts.push({ kind: "text", value: segment.value });
      continue;
    }

    if (segment.kind === "gap") {
      parts.push({ kind: "gap", id: segment.id });
      continue;
    }

    const pairedValue = assignments[segment.pairedGapId] ?? null;
    const closingTag = pairedValue ? getClosingTag(pairedValue) : null;

    if (closingTag) {
      parts.push({ kind: "text", value: closingTag });
    } else {
      parts.push({ kind: "gap", id: segment.id });
    }
  }

  return parts;
}

export function buildGroupLineColorizeText(
  parts: GroupLineBuildPart[],
): string {
  return parts
    .map((part) =>
      part.kind === "text" ? part.value : GAP_COLORIZE_PLACEHOLDER,
    )
    .join("");
}

export type GroupLineColorizedPart =
  | { kind: "html"; value: string }
  | { kind: "gap"; id: string };

export function mergeColorizedHtmlWithGaps(
  html: string,
  parts: GroupLineBuildPart[],
): GroupLineColorizedPart[] {
  const htmlChunks = html.split(GAP_COLORIZE_PLACEHOLDER);
  const merged: GroupLineColorizedPart[] = [];
  let chunkIndex = 0;

  for (const part of parts) {
    if (part.kind === "gap") {
      merged.push({ kind: "gap", id: part.id });
      continue;
    }

    merged.push({
      kind: "html",
      value: htmlChunks[chunkIndex++] ?? "",
    });
  }

  return merged;
}

export function stripGapColorizePlaceholders(text: string): string {
  return text.replaceAll(GAP_COLORIZE_PLACEHOLDER, "");
}
