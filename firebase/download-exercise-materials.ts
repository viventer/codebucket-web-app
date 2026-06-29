"use server";

import { ZipArchive } from "archiver";
import { z } from "zod";

import { adminStorage } from "@/firebase/admin-init";
import { getExerciseMaterialsFolderPath } from "@/lib/course-storage-paths";

const courseIdSchema = z
  .string()
  .min(1)
  .regex(/^[\w-]+$/, "Invalid course id");

const elementIdSchema = z
  .string()
  .min(1)
  .regex(/^[\w-]+$/, "Invalid element id");

const TEMP_ZIP_TTL_MS = 60 * 60 * 1000;

function normalizeStoragePath(path: string): string {
  const normalized = path.replace(/^\/+/, "");
  if (!normalized || normalized.includes("..")) {
    throw new Error(`Invalid storage path: ${path}`);
  }
  return normalized;
}

async function createFolderZipDownloadUrl(
  folderPath: string,
  downloadName: string,
): Promise<string> {
  const normalizedFolderPath = normalizeStoragePath(folderPath);
  const folderPrefix = `${normalizedFolderPath}/`;
  const bucket = adminStorage.bucket();
  const [files] = await bucket.getFiles({ prefix: folderPrefix });

  const filesToZip = files.filter((file) => {
    const relativeName = file.name.slice(folderPrefix.length);
    return relativeName.length > 0 && !relativeName.endsWith("/");
  });

  if (filesToZip.length === 0) {
    throw new Error(`Brak plików w folderze: ${normalizedFolderPath}`);
  }

  const safeDownloadName = downloadName.match(/^[\w-]+$/)
    ? downloadName
    : "materials";
  const tempZipPath = `temp-downloads/${safeDownloadName}-${Date.now()}.zip`;
  const tempFile = bucket.file(tempZipPath);
  const writeStream = tempFile.createWriteStream({
    metadata: {
      contentType: "application/zip",
      metadata: {
        deleteAt: new Date(Date.now() + TEMP_ZIP_TTL_MS).toISOString(),
      },
    },
  });

  const zipArchive = new ZipArchive({ zlib: { level: 6 } });
  zipArchive.pipe(writeStream);

  for (const file of filesToZip) {
    const relativeName = file.name.slice(folderPrefix.length);
    zipArchive.append(file.createReadStream(), { name: relativeName });
  }

  await zipArchive.finalize();

  await new Promise<void>((resolve, reject) => {
    writeStream.on("finish", () => resolve());
    writeStream.on("error", reject);
  });

  const [signedUrl] = await tempFile.getSignedUrl({
    action: "read",
    expires: Date.now() + TEMP_ZIP_TTL_MS,
  });

  return signedUrl;
}

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
