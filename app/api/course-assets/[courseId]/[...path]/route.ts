import { promises as fs } from "fs";
import path from "path";

import { getCourseFolder } from "@/lib/course-assets";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

type RouteContext = {
  params: Promise<{ courseId: string; path: string[] }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { courseId, path: pathSegments } = await context.params;
  const folder = getCourseFolder(courseId);

  if (!folder || pathSegments.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  const relativePath = pathSegments.join("/");
  if (relativePath.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(
    process.cwd(),
    "courses",
    folder,
    "media",
    relativePath,
  );

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] ?? "application/octet-stream";

    return new Response(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
