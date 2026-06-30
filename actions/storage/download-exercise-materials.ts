"use server";

import { z } from "zod";

import { createFolderZipDownloadUrl } from "@/actions/storage/create-folder-zip-download-url";
import { getExerciseMaterialsFolderPath } from "@/lib/course-storage-paths";

const courseIdSchema = z
  .string()
  .min(1)
  .regex(/^[\w-]+$/, "Invalid course id");

const elementIdSchema = z
  .string()
  .min(1)
  .regex(/^[\w-]+$/, "Invalid element id");

export async function getExerciseMaterialsDownloadUrl(
  courseId: string,
  elementId: string,
): Promise<string> {
  const parsedCourseId = courseIdSchema.parse(courseId);
  const parsedElementId = elementIdSchema.parse(elementId);
  const folderPath = getExerciseMaterialsFolderPath(
    parsedCourseId,
    parsedElementId,
  );

  return createFolderZipDownloadUrl(folderPath, parsedElementId);
}
