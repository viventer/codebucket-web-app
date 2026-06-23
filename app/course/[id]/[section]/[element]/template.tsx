"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  SECTION_OVERLAY_EXIT_MS,
  SECTION_OVERLAY_VISIBLE_MS,
} from "@/components/course/SectionTransitionOverlay";
import { useCourseNavigation } from "@/lib/course/navigation-transition-context";
import { usePrefersReducedMotion } from "@/lib/course/use-prefers-reduced-motion";

const SECTION_CONTENT_DELAY_MS =
  SECTION_OVERLAY_VISIBLE_MS + SECTION_OVERLAY_EXIT_MS;

function getContentMotionValues(
  direction: "forward" | "back" | "neutral",
  showSectionOverlay: boolean,
) {
  if (showSectionOverlay) {
    return {
      enterY: 24,
      duration: 0.45,
      delay: SECTION_CONTENT_DELAY_MS / 1000,
    };
  }

  if (direction === "back") {
    return {
      enterY: -12,
      duration: 0.25,
      delay: 0,
    };
  }

  if (direction === "forward") {
    return {
      enterY: 12,
      duration: 0.25,
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
  const { direction, showSectionOverlay } = transitionState;
  const motionValues = getContentMotionValues(direction, showSectionOverlay);
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
        delay: showSectionOverlay
          ? motionValues.delay
          : prefersReducedMotion
            ? 0
            : motionValues.delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
