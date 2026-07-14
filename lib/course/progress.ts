import type { CourseProgressEntry } from "@/schemas/userSchema";

export type SectionProgress = {
  completed: number;
  total: number;
  percent: number;
};

export function getCompletedElementIds(
  entry: CourseProgressEntry | undefined,
): Set<string> {
  return new Set(entry?.elementsCompleted ?? []);
}

export function getSectionsCompleted(
  entry: CourseProgressEntry | undefined,
): string[] {
  return entry?.sectionsCompleted ?? [];
}

export function getSectionProgress(
  sectionElementIds: string[],
  completedIds: Set<string>,
): SectionProgress {
  const total = sectionElementIds.length;
  const completed = sectionElementIds.filter((id) => completedIds.has(id)).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percent };
}
