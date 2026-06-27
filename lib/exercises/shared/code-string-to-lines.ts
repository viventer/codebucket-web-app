import type { FillGapsLine } from "@/schemas/courseSchema";

export function codeStringToLines(code: string): FillGapsLine[] {
  return code.split("\n").map((text) => ({
    kind: "code",
    text,
    indent: 0,
  }));
}
