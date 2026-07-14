/**
 * Section IDs guests may access without registration, per course.
 * Update when seeding a new course — include every section with order < 2
 * (i.e. the first two sections by outline order: order 0 and order 1).
 */
const GUEST_FREE_SECTION_IDS: Record<string, readonly string[]> = {
  "html-fundamentals": ["introduction", "fundamentals"],
};

export function isGuestFreeSection(
  courseId: string,
  sectionId: string,
): boolean {
  const freeIds = GUEST_FREE_SECTION_IDS[courseId];
  if (!freeIds) return false;
  return freeIds.includes(sectionId);
}

export function parseCourseElementPath(pathname: string): {
  courseId: string;
  sectionId: string;
} | null {
  const match = /^\/course\/([^/]+)\/([^/]+)\/[^/]+$/.exec(pathname);
  if (!match) return null;
  return { courseId: match[1], sectionId: match[2] };
}
