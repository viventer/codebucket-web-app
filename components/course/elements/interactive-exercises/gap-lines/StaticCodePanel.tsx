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
  embedded?: boolean;
  className?: string;
};

function StaticCodePanelLines({
  code,
  language,
  typography,
}: Pick<StaticCodePanelProps, "code" | "language" | "typography">) {
  const lines = codeStringToLines(code);

  return (
    <div
      className={cn(
        "font-mono flex flex-col gap-4",
        typography === "large" ? "text-xl sm:text-2xl" : "text-sm",
      )}
    >
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
    </div>
  );
}

export function StaticCodePanel({
  code,
  language,
  typography = "default",
  embedded = false,
  className,
}: StaticCodePanelProps) {
  const lines = <StaticCodePanelLines code={code} language={language} typography={typography} />;

  if (embedded) {
    return (
      <div className={cn("overflow-auto", className)}>
        {lines}
      </div>
    );
  }

  return (
    <Card
      className={cn("bg-card/30 overflow-auto max-w-[90vw]", className)}
    >
      <CardContent className="flex flex-col gap-4">{lines}</CardContent>
    </Card>
  );
}
