"use client";

import { useEffect, useState } from "react";

import { colorizeCode } from "@/lib/monaco/setup";
import { useCodeTheme } from "@/lib/monaco/use-code-theme";
import type { Language } from "@/schemas/courseSchema";

import {
  buildLineColorizePlainText,
  getLineSegmentRanges,
  type CodeLineSegment,
  type CodeLineSegmentRange,
} from "./line-segments";

export function useColorizedLine(
  segments: CodeLineSegment[],
  assignments: Record<string, string | null>,
  language: Language,
): {
  colorizedHtml: string | null;
  segmentRanges: CodeLineSegmentRange[];
} {
  const mode = useCodeTheme();
  const [colorizedHtml, setColorizedHtml] = useState<string | null>(null);

  const plainText = buildLineColorizePlainText(segments, assignments);
  const segmentRanges = getLineSegmentRanges(segments, assignments);

  useEffect(() => {
    let cancelled = false;

    void colorizeCode(plainText, language, mode).then((html) => {
      if (!cancelled) setColorizedHtml(html);
    });

    return () => {
      cancelled = true;
    };
  }, [language, mode, plainText]);

  return { colorizedHtml, segmentRanges };
}
