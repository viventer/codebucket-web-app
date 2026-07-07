import type { FillGapsLine } from "@/schemas/exerciseSchema";

export function codeStringToLines(code: string): FillGapsLine[] {
  return code.split("\n").map((text) => ({
    kind: "code",
    text,
    indent: 0,
  }));
}
