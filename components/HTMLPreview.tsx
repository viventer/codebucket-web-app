"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type HTMLPreviewProps = {
  html: string;
  className?: string;
  title?: string;
};

function readThemeColors(): { background: string; color: string } {
  const styles = getComputedStyle(document.documentElement);
  return {
    background: styles.getPropertyValue("--card").trim() || "white",
    color: styles.getPropertyValue("--foreground").trim() || "black",
  };
}

function buildSrcDoc(
  html: string,
  colors: { background: string; color: string },
): string {
  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 1rem;
    background: ${colors.background};
    color: ${colors.color};
    font-family: system-ui, sans-serif;
    line-height: 1.5;
  }
</style>
</head>
<body>${html}</body>
</html>`;
}

export function HTMLPreview({
  html,
  className,
  title = "Podgląd HTML",
}: HTMLPreviewProps) {
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    const updateSrcDoc = () => {
      setSrcDoc(buildSrcDoc(html, readThemeColors()));
    };

    updateSrcDoc();

    const observer = new MutationObserver(updateSrcDoc);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateSrcDoc);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", updateSrcDoc);
    };
  }, [html]);

  return (
    <Card className={cn("h-full min-h-48 overflow-hidden", className)}>
      <CardContent className="h-full p-0">
        <iframe
          srcDoc={srcDoc}
          sandbox=""
          title={title}
          className="block h-full min-h-48 w-full border-0 bg-card"
        />
      </CardContent>
    </Card>
  );
}
