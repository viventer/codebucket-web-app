"use server";

import { z } from "zod";

import { createFolderZipDownloadUrl } from "@/actions/storage/create-folder-zip-download-url";
import { getCheatsheetFolderPath } from "@/actions/storage/course-storage-paths";

const courseIdSchema = z
  .string()
  .min(1)
  .regex(/^[\w-]+$/, "Invalid course id");

const cheatsheetIdSchema = z
  .string()
  .min(1)
  .regex(/^[\w-]+$/, "Invalid cheatsheet id");

export async function getCheatsheetDownloadUrl(
  courseId: string,
  cheatsheetId: string,
): Promise<string> {
  const parsedCourseId = courseIdSchema.parse(courseId);
  const parsedCheatsheetId = cheatsheetIdSchema.parse(cheatsheetId);
  const folderPath = getCheatsheetFolderPath(
    parsedCourseId,
    parsedCheatsheetId,
  );

  return createFolderZipDownloadUrl(folderPath, parsedCheatsheetId);
}
