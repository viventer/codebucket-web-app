"use client";

import { useEffect, useMemo, useState } from "react";

import { colorizeCode } from "@/lib/monaco/setup";
import { useCodeTheme } from "@/lib/monaco/use-code-theme";
import type { Language } from "@/schemas/courseSchema";

import {
  buildGroupColorizePlainText,
  getGroupSegmentRanges,
  type GroupSegment,
  type GroupSegmentRange,
} from "./group-line-utils";

export function useColorizedGroupLine(
  segments: GroupSegment[],
  assignments: Record<string, string | null>,
  language: Language,
): {
  colorizedHtml: string | null;
  segmentRanges: GroupSegmentRange[];
} {
  const mode = useCodeTheme();
  const [colorizedHtml, setColorizedHtml] = useState<string | null>(null);

  const plainText = useMemo(
    () => buildGroupColorizePlainText(segments, assignments),
    [assignments, segments],
  );

  const segmentRanges = useMemo(
    () => getGroupSegmentRanges(segments, assignments),
    [assignments, segments],
  );

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
