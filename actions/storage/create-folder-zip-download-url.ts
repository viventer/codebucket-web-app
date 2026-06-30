"use server";

import { ZipArchive } from "archiver";

import { adminStorage } from "@/firebase/admin-init";
import { normalizeStoragePath } from "@/actions/helpers";

const TEMP_ZIP_TTL_MS = 60 * 60 * 1000;

export async function createFolderZipDownloadUrl(
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
