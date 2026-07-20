/** Courses currently available to the application and their seed folders. */
export const COURSE_SEED_REGISTRY: Record<string, { folder: string }> = {
  "html-fundamentals": { folder: "html fundamentals" },
  "css-basics": { folder: "css fundamentals" },
};

export function isRegisteredCourse(courseId: string): boolean {
  return Object.hasOwn(COURSE_SEED_REGISTRY, courseId);
}

