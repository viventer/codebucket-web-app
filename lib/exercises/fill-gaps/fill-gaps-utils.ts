import type { FillGapsLine } from "@/schemas/exerciseSchema";

import type { CheckResult } from "../shared/types";

export type GapLinesContent = {
  language: "html" | "css" | "javascript";
  lines: FillGapsLine[];
};

export type FillGapsStageContent = GapLinesContent & {
  options: string[];
};

export function getGapAnswers(
  content: GapLinesContent,
): { id: string; answer: string }[] {
  const gaps: { id: string; answer: string }[] = [];

  for (const line of content.lines) {
    if (line.kind === "gap") {
      gaps.push({ id: line.id, answer: line.answer });
      continue;
    }

    if (line.kind === "group") {
      for (const segment of line.segments) {
        if (segment.kind === "gap") {
          gaps.push({ id: segment.id, answer: segment.answer });
        }
      }
    }
  }

  return gaps;
}

export function getGapIds(content: GapLinesContent): string[] {
  return getGapAnswers(content).map((gap) => gap.id);
}

export function getFirstEmptyGapId(
  gapIds: string[],
  assignments: Record<string, string | null>,
): string | null {
  return gapIds.find((id) => assignments[id] === null) ?? null;
}

export function createInitialAssignments(
  gapIds: string[],
): Record<string, string | null> {
  const assignments: Record<string, string | null> = {};
  for (const id of gapIds) {
    assignments[id] = null;
  }
  return assignments;
}

function gapAnswersMatch(
  assignment: string | null,
  answer: string,
  caseInsensitive: boolean,
): boolean {
  if (assignment === null) {
    return false;
  }

  if (caseInsensitive) {
    return assignment.toLowerCase() === answer.toLowerCase();
  }

  return assignment === answer;
}

export function evaluateFillGapsCheck(
  content: GapLinesContent,
  assignments: Record<string, string | null>,
  options?: { caseInsensitive?: boolean },
): CheckResult {
  const caseInsensitive = options?.caseInsensitive ?? false;
  const gaps = getGapAnswers(content);

  if (gaps.some((gap) => assignments[gap.id] === null)) {
    return "warning";
  }

  const allCorrect = gaps.every((gap) =>
    gapAnswersMatch(assignments[gap.id], gap.answer, caseInsensitive),
  );

  return allCorrect ? "success" : "error";
}

export function getAvailableOptions(
  content: FillGapsStageContent,
  assignments: Record<string, string | null>,
): string[] {
  const assignedValues = Object.values(assignments).filter(
    (value): value is string => value !== null,
  );
  const remaining = [...content.options];
  for (const value of assignedValues) {
    const idx = remaining.indexOf(value);
    if (idx !== -1) remaining.splice(idx, 1);
  }
  return remaining;
}

export function applyFillGapsSolution(
  content: GapLinesContent,
  assignments: Record<string, string | null>,
): Record<string, string | null> {
  const solution: Record<string, string | null> = { ...assignments };
  for (const gap of getGapAnswers(content)) {
    solution[gap.id] = gap.answer;
  }
  return solution;
}

export function getClosingTag(openingTag: string): string {
  const fullTagMatch = openingTag.match(/^<([a-zA-Z][\w-]*)>$/);
  if (fullTagMatch) return `</${fullTagMatch[1]}>`;

  const tagNameMatch = openingTag.match(/^([a-zA-Z][\w-]*)$/);
  if (tagNameMatch) return `</${tagNameMatch[1]}>`;

  return openingTag;
}

export type StageFeedbackTarget = "presentation" | "codePanel";

export function getStageFeedbackTarget(
  presentationKind: "image" | "preview" | "code",
): StageFeedbackTarget {
  return presentationKind === "image" ? "presentation" : "codePanel";
}
