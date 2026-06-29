"use client";

import { useSyncExternalStore } from "react";

import { mockUser } from "@/lib/mock-user";

export type ThemeColors = {
  background: string;
  color: string;
  scrollbarThumb: string;
  scrollbarTrack: string;
};

const THEME_COLORS: Record<"light" | "dark", ThemeColors> = {
  light: {
    background: "oklch(1 0 0)",
    color: "oklch(0.145 0 0)",
    scrollbarThumb: "oklch(0.451 0.084 223.8)",
    scrollbarTrack: "oklch(1 0 0)",
  },
  dark: {
    background: "oklch(0.205 0 0)",
    color: "oklch(0.985 0 0)",
    scrollbarThumb: "oklch(0.451 0.084 223.8)",
    scrollbarTrack: "oklch(0.205 0 0)",
  },
};

function getServerThemeColors(): ThemeColors {
  const scheme = mockUser.preferences.colorScheme;
  return THEME_COLORS[scheme === "dark" ? "dark" : "light"];
}

function readThemeColors(): ThemeColors {
  const styles = getComputedStyle(document.documentElement);
  const fallback = THEME_COLORS.light;

  return {
    background:
      styles.getPropertyValue("--card").trim() || fallback.background,
    color:
      styles.getPropertyValue("--foreground").trim() || fallback.color,
    scrollbarThumb:
      styles.getPropertyValue("--primary").trim() || fallback.scrollbarThumb,
    scrollbarTrack:
      styles.getPropertyValue("--card").trim() || fallback.scrollbarTrack,
  };
}

function serializeThemeColors(colors: ThemeColors): string {
  return `${colors.background}\0${colors.color}\0${colors.scrollbarThumb}\0${colors.scrollbarTrack}`;
}

function parseThemeSnapshot(snapshot: string): ThemeColors {
  const [background, color, scrollbarThumb, scrollbarTrack] =
    snapshot.split("\0");
  const fallback = THEME_COLORS.light;

  return {
    background: background || fallback.background,
    color: color || fallback.color,
    scrollbarThumb: scrollbarThumb || fallback.scrollbarThumb,
    scrollbarTrack: scrollbarTrack || fallback.scrollbarTrack,
  };
}

function subscribeTheme(onStoreChange: () => void): () => void {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    observer.disconnect();
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

function getThemeSnapshot(): string {
  return serializeThemeColors(readThemeColors());
}

function getServerThemeSnapshot(): string {
  return serializeThemeColors(getServerThemeColors());
}

export function useThemeColors(): ThemeColors {
  const snapshot = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  return parseThemeSnapshot(snapshot);
}

export function buildSrcDoc(html: string, colors: ThemeColors): string {
  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html {
    scrollbar-color: ${colors.scrollbarThumb} ${colors.scrollbarTrack};
  }
  html::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  html::-webkit-scrollbar-track {
    background: ${colors.scrollbarTrack};
  }
  html::-webkit-scrollbar-thumb {
    background-color: ${colors.scrollbarThumb};
    border-radius: 9999px;
    border: 2px solid ${colors.scrollbarTrack};
  }
  body {
    margin: 0;
    background: ${colors.background};
    color: ${colors.color};
    font-family: system-ui, sans-serif;
    padding: 0 2rem;
  }
</style>
</head>
<body>${html}</body>
</html>`;
}
