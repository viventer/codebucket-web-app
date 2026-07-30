"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  COURSES_SECTION_ID,
  scrollToCoursesSection,
} from "@/lib/scroll-to-courses-section";

export function ScrollSnapController() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    const hasCoursesHash =
      window.location.hash === `#${COURSES_SECTION_ID}`;

    if (hasCoursesHash) {
      // Scroll before enabling snap so proximity snap cannot pull us mid-section.
      const frame = requestAnimationFrame(() => {
        scrollToCoursesSection({ behavior: "auto" });
        root.classList.add("snap-page");
      });

      return () => {
        cancelAnimationFrame(frame);
        root.classList.remove("snap-page");
      };
    }

    root.classList.add("snap-page");

    if (prefersReducedMotion) {
      return () => {
        root.classList.remove("snap-page");
      };
    }

    if (window.scrollY < 4) {
      window.scrollTo(0, 0);
    }

    return () => {
      root.classList.remove("snap-page");
    };
  }, [prefersReducedMotion]);

  return null;
}
