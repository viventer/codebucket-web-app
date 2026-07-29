"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function ScrollSnapController() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = document.documentElement;

    root.classList.add("snap-page");

    if (prefersReducedMotion) return;

    const scrollY = window.scrollY;

    if (scrollY < 4) {
      window.scrollTo(0, 0);
    }

    return () => {
      root.classList.remove("snap-page");
    };
  }, [prefersReducedMotion]);

  return null;
}
