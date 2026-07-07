export function normalizeStoragePath(path: string): string {
  const normalized = path.replace(/^\/+/, "");
  if (!normalized || normalized.includes("..")) {
    throw new Error(`Invalid storage path: ${path}`);
  }
  return normalized;
}
