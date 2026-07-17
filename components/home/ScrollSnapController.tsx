"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function ScrollSnapController() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const root = document.documentElement;
    const scrollY = window.scrollY;

    root.classList.add("snap-page");

    if (scrollY < 4) {
      window.scrollTo(0, 0);
    }

    return () => {
      root.classList.remove("snap-page");
    };
  }, [prefersReducedMotion]);

  return null;
}
