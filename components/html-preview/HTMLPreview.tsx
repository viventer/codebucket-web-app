"use client";

import { useEffect, useRef, useState } from "react";

import { buildSrcDoc, useThemeColors } from "@/components/html-preview/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type HTMLPreviewProps = {
  html: string;
  className?: string;
  title?: string;
};

export function HTMLPreview({
  html,
  className,
  title = "Podgląd HTML",
}: HTMLPreviewProps) {
  const themeColors = useThemeColors();
  const srcDoc = buildSrcDoc(html, themeColors);

  const containerRef = useRef<HTMLDivElement>(null);
  const hasRefreshedOnVisibleRef = useRef(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    hasRefreshedOnVisibleRef.current = false;

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasRefreshedOnVisibleRef.current) {
          hasRefreshedOnVisibleRef.current = true;
          setRefreshKey((key) => key + 1);
        }
      },
      { threshold: 0 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [html]);

  return (
    <Card
      ref={containerRef}
      className={cn(
        "flex h-full min-h-96 flex-col overflow-hidden p-0",
        className,
      )}
    >
      <CardContent className="relative min-h-0 flex-1 p-0">
        <iframe
          key={`${html}-${refreshKey}`}
          srcDoc={srcDoc}
          sandbox=""
          title={title}
          className="absolute inset-0 h-full w-full border-0 bg-card"
        />
      </CardContent>
    </Card>
  );
}
