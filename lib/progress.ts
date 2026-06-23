import type { Course } from "@/schemas/courseSchema";
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
  course: Course,
  sectionId: string,
  user: User,
): SectionProgress {
  const section = course.sections.find((s) => s.id === sectionId);
  const total = section?.elements.length ?? 0;
  const completedIds = getCompletedElementIds(user, course.id);
  const completed =
    section?.elements.filter((element) => completedIds.has(element.id)).length ??
    0;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { completed, total, percent };
}
