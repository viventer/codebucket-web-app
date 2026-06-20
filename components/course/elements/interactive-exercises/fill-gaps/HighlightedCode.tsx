"use client";

import { useEffect, useState } from "react";

import { colorizeCode } from "@/lib/monaco/setup";
import { useCodeTheme } from "@/lib/monaco/use-code-theme";
import { cn } from "@/lib/utils";
import type { Language } from "@/schemas/courseSchema";

type HighlightedCodeProps = {
  text: string;
  language: Language;
  className?: string;
};

export function HighlightedCode({
  text,
  language,
  className,
}: HighlightedCodeProps) {
  const mode = useCodeTheme();
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void colorizeCode(text, language, mode).then((result) => {
      if (!cancelled) setHtml(result);
    });

    return () => {
      cancelled = true;
    };
  }, [text, language, mode]);

  if (!html) {
    return (
      <span className={cn("inline text-foreground", className)}>{text}</span>
    );
  }

  return (
    <span
      className={cn("inline", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
