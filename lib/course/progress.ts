import type { User } from "@/schemas/userSchema";

export type SectionProgress = {
  completed: number;
  total: number;
  percent: number;
};

export function getCompletedElementIds(
  user: User,
  courseId: string,
): Set<string> {
  const progress = user.courseProgress.find((p) => p.courseId === courseId);
  return new Set(progress?.elementsCompleted ?? []);
}

export function getSectionsCompleted(
  user: User,
  courseId: string,
): string[] {
  const progress = user.courseProgress.find((p) => p.courseId === courseId);
  return progress?.sectionsCompleted ?? [];
}

export function getSectionProgress(
  courseId: string,
  sectionElementIds: string[],
  user: User,
): SectionProgress {
  const completedIds = getCompletedElementIds(user, courseId);
  const total = sectionElementIds.length;
  const completed = sectionElementIds.filter((elementId) =>
    completedIds.has(elementId),
  ).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { completed, total, percent };
}
