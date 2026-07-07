"use server";

import { z } from "zod";

import { createFolderZipDownloadUrl } from "@/actions/storage/create-folder-zip-download-url";
import {
  getExerciseMaterialsFolderPath,
  getGuidedProjectMaterialsFolderPath,
} from "@/actions/storage/course-storage-paths";

const courseIdSchema = z
  .string()
  .min(1)
  .regex(/^[\w-]+$/, "Invalid course id");

const elementIdSchema = z
  .string()
  .min(1)
  .regex(/^[\w-]+$/, "Invalid element id");

const materialsSourceSchema = z.enum(["exercise", "guidedProject"]);

export async function getExerciseMaterialsDownloadUrl(
  courseId: string,
  elementId: string,
  source: "exercise" | "guidedProject" = "exercise",
): Promise<string> {
  const parsedCourseId = courseIdSchema.parse(courseId);
  const parsedElementId = elementIdSchema.parse(elementId);
  const parsedSource = materialsSourceSchema.parse(source);
  const folderPath =
    parsedSource === "guidedProject"
      ? getGuidedProjectMaterialsFolderPath(parsedCourseId, parsedElementId)
      : getExerciseMaterialsFolderPath(parsedCourseId, parsedElementId);

  return createFolderZipDownloadUrl(folderPath, parsedElementId);
}
