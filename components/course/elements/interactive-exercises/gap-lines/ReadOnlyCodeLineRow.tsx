"use client";

import { sliceColorizedHtml } from "@/lib/monaco/slice-colorized-html";
import type { Language } from "@/schemas/exerciseSchema";

import { ColorizedText } from "./ColorizedText";
import { useColorizedLine } from "./use-colorized-line";

type ReadOnlyCodeLineRowProps = {
  text: string;
  language: Language;
};

export function ReadOnlyCodeLineRow({
  text,
  language,
}: ReadOnlyCodeLineRowProps) {
  const segments = [{ kind: "text" as const, value: text }];
  const { colorizedHtml, segmentRanges } = useColorizedLine(
    segments,
    {},
    language,
  );

  const range = segmentRanges[0];
  const slicedHtml =
    colorizedHtml && range
      ? sliceColorizedHtml(colorizedHtml, range.plainStart, range.plainEnd)
      : null;

  return (
    <div className="flex flex-wrap items-center gap-y-1">
      <ColorizedText html={slicedHtml} fallback={text} />
    </div>
  );
}
