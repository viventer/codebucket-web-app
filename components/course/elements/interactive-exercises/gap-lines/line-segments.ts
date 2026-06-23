import type { FillGapsLine } from "@/schemas/courseSchema";
import { getClosingTag } from "@/lib/exercises/fill-gaps-utils";

export type CodeLineSegment =
  | { kind: "text"; value: string }
  | { kind: "gap"; id: string; answer: string }
  | { kind: "autoClose"; id: string; pairedGapId: string };

export type CodeLineSegmentRange = {
  segmentIndex: number;
  plainStart: number;
  plainEnd: number;
};

export function lineToSegments(line: FillGapsLine): CodeLineSegment[] {
  switch (line.kind) {
    case "code":
      return [{ kind: "text", value: line.text }];
    case "gap":
      return [{ kind: "gap", id: line.id, answer: line.answer }];
    case "autoClose":
      return [
        {
          kind: "autoClose",
          id: line.id,
          pairedGapId: line.pairedGapId,
        },
      ];
    case "group":
      return line.segments;
  }
}

export function getSegmentPlainText(
  segment: CodeLineSegment,
  assignments: Record<string, string | null>,
): string {
  if (segment.kind === "text") {
    return segment.value;
  }

  if (segment.kind === "gap") {
    return assignments[segment.id] ?? segment.answer;
  }

  const pairedValue = assignments[segment.pairedGapId] ?? null;
  return pairedValue ? getClosingTag(pairedValue) : "";
}

export function buildLineColorizePlainText(
  segments: CodeLineSegment[],
  assignments: Record<string, string | null>,
): string {
  return segments
    .map((segment) => getSegmentPlainText(segment, assignments))
    .join("");
}

export function getLineSegmentRanges(
  segments: CodeLineSegment[],
  assignments: Record<string, string | null>,
): CodeLineSegmentRange[] {
  const ranges: CodeLineSegmentRange[] = [];
  let offset = 0;

  segments.forEach((segment, segmentIndex) => {
    const plain = getSegmentPlainText(segment, assignments);

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

function getLineKey(line: FillGapsLine, index: number): string {
  if (line.kind === "code") return `code-${index}`;
  if (line.kind === "group") return `group-${index}`;
  return line.id;
}

export { getLineKey };
