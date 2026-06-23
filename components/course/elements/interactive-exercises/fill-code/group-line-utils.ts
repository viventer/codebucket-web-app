import type { FillGapsLine } from "@/schemas/courseSchema";
import { getClosingTag } from "@/lib/exercises/fill-gaps-utils";

export type GroupSegment = Extract<
  FillGapsLine,
  { kind: "group" }
>["segments"][number];

export type GroupSegmentRange = {
  segmentIndex: number;
  plainStart: number;
  plainEnd: number;
};

function getPairedGapAnswer(
  segments: GroupSegment[],
  pairedGapId: string,
): string | null {
  const pairedGap = segments.find(
    (segment) => segment.kind === "gap" && segment.id === pairedGapId,
  );

  return pairedGap && pairedGap.kind === "gap" ? pairedGap.answer : null;
}

export function getGroupSegmentPlainText(
  segment: GroupSegment,
  segments: GroupSegment[],
  assignments: Record<string, string | null>,
): string {
  if (segment.kind === "text") {
    return segment.value;
  }

  if (segment.kind === "gap") {
    return assignments[segment.id] ?? segment.answer;
  }

  const pairedValue = assignments[segment.pairedGapId] ?? null;
  if (pairedValue) {
    return getClosingTag(pairedValue);
  }

  const pairedAnswer = getPairedGapAnswer(segments, segment.pairedGapId);
  return pairedAnswer ? getClosingTag(pairedAnswer) : "";
}

export function buildGroupColorizePlainText(
  segments: GroupSegment[],
  assignments: Record<string, string | null>,
): string {
  return segments
    .map((segment) =>
      getGroupSegmentPlainText(segment, segments, assignments),
    )
    .join("");
}

export function getGroupSegmentRanges(
  segments: GroupSegment[],
  assignments: Record<string, string | null>,
): GroupSegmentRange[] {
  const ranges: GroupSegmentRange[] = [];
  let offset = 0;

  segments.forEach((segment, segmentIndex) => {
    const plain = getGroupSegmentPlainText(segment, segments, assignments);

    if (segment.kind === "text" || segment.kind === "autoClose") {
      ranges.push({
        segmentIndex,
        plainStart: offset,
        plainEnd: offset + plain.length,
      });
    }

    offset += plain.length;
  });

  return ranges;
}
