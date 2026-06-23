"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useCourseNavigation } from "@/lib/course/navigation-transition-context";
import { usePrefersReducedMotion } from "@/lib/course/use-prefers-reduced-motion";

const SECTION_OVERLAY_MS = 1400;

function getContentMotionValues(
  direction: "forward" | "back" | "neutral",
  showSectionOverlay: boolean,
  isSectionBoundary: boolean,
) {
  if (showSectionOverlay) {
    return {
      enterY: 24,
      duration: 0.45,
      delay: SECTION_OVERLAY_MS / 1000,
    };
  }

  if (direction === "back") {
    return {
      enterY: isSectionBoundary ? -32 : -12,
      duration: isSectionBoundary ? 0.5 : 0.25,
      delay: 0,
    };
  }

  if (direction === "forward") {
    return {
      enterY: isSectionBoundary ? 32 : 12,
      duration: isSectionBoundary ? 0.7 : 0.25,
      delay: 0,
    };
  }

  return {
    enterY: 8,
    duration: 0.2,
    delay: 0,
  };
}

type CourseElementTemplateProps = {
  children: ReactNode;
};

export default function CourseElementTemplate({
  children,
}: CourseElementTemplateProps) {
  const pathname = usePathname();
  const { transitionState } = useCourseNavigation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { direction, isSectionBoundary, showSectionOverlay } = transitionState;
  const motionValues = getContentMotionValues(
    direction,
    showSectionOverlay,
    isSectionBoundary,
  );
  const useReducedSectionTransition =
    prefersReducedMotion && showSectionOverlay;

  return (
    <motion.div
      key={pathname}
      initial={{
        opacity: useReducedSectionTransition || !prefersReducedMotion ? 0 : 1,
        y:
          prefersReducedMotion && !showSectionOverlay
            ? 0
            : useReducedSectionTransition
              ? 0
              : motionValues.enterY,
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration:
          prefersReducedMotion && !showSectionOverlay
            ? 0
            : useReducedSectionTransition
              ? 0
              : motionValues.duration,
        delay: showSectionOverlay ? motionValues.delay : prefersReducedMotion ? 0 : motionValues.delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
