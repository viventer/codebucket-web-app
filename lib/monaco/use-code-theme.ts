"use client";

import { useEffect, useState } from "react";

import { clearColorizeCache } from "./setup";
import { type CodeThemeMode, getCodeThemeMode } from "./theme-colors";

export function useCodeTheme(): CodeThemeMode {
  const [mode, setMode] = useState<CodeThemeMode>(() =>
    typeof document === "undefined" ? "light" : getCodeThemeMode(),
  );

  useEffect(() => {
    const updateMode = () => {
      const nextMode = getCodeThemeMode();
      setMode((current) => {
        if (current !== nextMode) {
          clearColorizeCache();
        }
        return nextMode;
      });
    };

    updateMode();

    const observer = new MutationObserver(updateMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", updateMode);
    };
  }, []);

  return mode;
}
