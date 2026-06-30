const CHEATSHEET_IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
]);

export function getCheatsheetFileOrder(filename: string): number {
  const match = filename.match(/^(\d+)/);
  return match ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}

export function sortCheatsheetFilenames(filenames: string[]): string[] {
  return [...filenames].sort(
    (a, b) => getCheatsheetFileOrder(a) - getCheatsheetFileOrder(b),
  );
}

export function isCheatsheetImageFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  return [...CHEATSHEET_IMAGE_EXTENSIONS].some((extension) =>
    lower.endsWith(extension),
  );
}
