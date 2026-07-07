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

export function getExerciseMaterialsFolderPath(
  courseId: string,
  elementId: string,
): string {
  return `courses/${courseId}/exercises/${elementId}/materials`;
}

export function getGuidedProjectMaterialsFolderPath(
  courseId: string,
  elementId: string,
): string {
  return `courses/${courseId}/guided-projects/${elementId}/materials`;
}

export function getCheatsheetFolderPath(
  courseId: string,
  cheatsheetId: string,
): string {
  return `courses/${courseId}/cheatsheets/${cheatsheetId}`;
}
