"use client";

import { codeStringToLines } from "@/lib/exercises/shared/code-string-to-lines";
import { cn } from "@/lib/utils";
import type { Language } from "@/schemas/courseSchema";

import { Card, CardContent } from "@/components/ui/card";

import { getLineKey } from "./line-segments";
import { ReadOnlyCodeLineRow } from "./ReadOnlyCodeLineRow";

const INDENT_PX = 24;

type StaticCodePanelProps = {
  code: string;
  language: Language;
  typography?: "default" | "large";
  className?: string;
};

export function StaticCodePanel({
  code,
  language,
  typography = "default",
  className,
}: StaticCodePanelProps) {
  const lines = codeStringToLines(code);

  return (
    <Card
      className={cn(
        "font-mono bg-card/30 overflow-auto max-w-[90vw]",
        typography === "large" ? "text-xl sm:text-2xl" : "text-sm",
        className,
      )}
    >
      <CardContent className="flex flex-col gap-4">
        {lines.map((line, index) => {
          if (line.kind !== "code") return null;

          return (
            <div
              key={getLineKey(line, index)}
              style={{ paddingLeft: line.indent * INDENT_PX }}
            >
              <ReadOnlyCodeLineRow text={line.text} language={language} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
