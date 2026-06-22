const COURSE_FOLDERS: Record<string, string> = {
  "html-fundamentals": "html fundamentals",
  "css-basics": "css fundamentals",
};

export function getCourseFolder(courseId: string): string | undefined {
  return COURSE_FOLDERS[courseId];
}

export function getCourseAssetUrl(
  courseId: string,
  relativePath: string,
): string {
  const normalized = relativePath.replace(/^\/+/, "");
  return `/api/course-assets/${courseId}/${normalized}`;
}
