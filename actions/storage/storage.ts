"use server";

import { getDownloadURL } from "firebase-admin/storage";
import { z } from "zod";

import { adminStorage } from "@/firebase/admin-init";
import { normalizeStoragePath } from "@/actions/helpers";

async function resolvePublicStorageUrl(storagePath: string): Promise<string> {
  const normalized = normalizeStoragePath(storagePath);
  const file = adminStorage.bucket().file(normalized);
  const [exists] = await file.exists();

  if (!exists) {
    throw new Error(`Storage file not found: ${normalized}`);
  }

  return getDownloadURL(file);
}

const storagePathSchema = z
  .string()
  .min(1, "Storage path is required")
  .refine((path) => !path.includes(".."), "Storage path must not contain ..");

const storagePathsSchema = z.array(storagePathSchema).min(1);

export async function getPublicStorageUrl(
  storagePath: string,
): Promise<string> {
  const parsed = storagePathSchema.parse(storagePath);
  return resolvePublicStorageUrl(parsed);
}

export async function getPublicStorageUrls(
  storagePaths: string[],
): Promise<Record<string, string>> {
  const parsed = storagePathsSchema.parse(storagePaths);
  const uniquePaths = [...new Set(parsed.map(normalizeStoragePath))];

  const entries = await Promise.all(
    uniquePaths.map(async (path) => {
      const url = await resolvePublicStorageUrl(path);
      return [path, url] as const;
    }),
  );

  return Object.fromEntries(entries);
}
