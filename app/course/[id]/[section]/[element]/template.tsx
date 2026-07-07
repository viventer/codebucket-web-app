"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  TRANSITION_OVERLAY_EXIT_MS,
  TRANSITION_OVERLAY_VISIBLE_MS,
} from "@/components/course/CourseTransitionOverlay";
import { useCourseNavigation } from "@/lib/course/navigation-transition-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSkipInitialMotion } from "@/hooks/use-skip-initial-motion";

const TRANSITION_CONTENT_DELAY_MS =
  TRANSITION_OVERLAY_VISIBLE_MS + TRANSITION_OVERLAY_EXIT_MS;

function getContentMotionValues(
  direction: "forward" | "back" | "neutral",
  showTransitionOverlay: boolean,
) {
  if (showTransitionOverlay) {
    return {
      enterY: 24,
      duration: 0.45,
      delay: TRANSITION_CONTENT_DELAY_MS / 1000,
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
  const skipInitialMotion = useSkipInitialMotion();
  const { direction, showTransitionOverlay } = transitionState;
  const motionValues = getContentMotionValues(direction, showTransitionOverlay);
  const useReducedTransition = prefersReducedMotion && showTransitionOverlay;

  const motionInitial = skipInitialMotion
    ? false
    : {
        opacity: useReducedTransition || !prefersReducedMotion ? 0 : 1,
        y:
          prefersReducedMotion && !showTransitionOverlay
            ? 0
            : useReducedTransition
              ? 0
              : motionValues.enterY,
      };

  return (
    <motion.div
      key={pathname}
      initial={motionInitial}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration:
          prefersReducedMotion && !showTransitionOverlay
            ? 0
            : useReducedTransition
              ? 0
              : motionValues.duration,
        delay: showTransitionOverlay
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
