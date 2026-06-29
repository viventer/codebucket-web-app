export function getCourseLogoStoragePath(
  courseId: string,
  filename: string,
): string {
  const normalizedFilename = filename.replace(/^\/+/, "");
  return `courses/${courseId}/${normalizedFilename}`;
}

export function getExerciseAssetStoragePath(
  courseId: string,
  elementId: string,
  filename: string,
): string {
  const normalizedFilename = filename.replace(/^\/+/, "");
  return `courses/${courseId}/exercises/${elementId}/${normalizedFilename}`;
}
