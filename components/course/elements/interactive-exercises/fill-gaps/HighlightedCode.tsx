"use client";

import { useEffect, useState } from "react";

import { colorizeCode } from "@/lib/monaco/setup";
import { useCodeTheme } from "@/lib/monaco/use-code-theme";
import type { Language } from "@/schemas/courseSchema";

type HighlightedCodeProps = {
  text: string;
  language: Language;
};

export function HighlightedCode({ text, language }: HighlightedCodeProps) {
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
    return <span className="text-foreground">{text}</span>;
  }

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
