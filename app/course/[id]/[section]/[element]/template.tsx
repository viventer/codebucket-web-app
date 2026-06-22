"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useCourseNavigation } from "@/lib/course/navigation-transition-context";
import { usePrefersReducedMotion } from "@/lib/course/use-prefers-reduced-motion";

import { SectionTransitionOverlay } from "@/components/course/SectionTransitionOverlay";

function getContentMotionValues(
  direction: "forward" | "back" | "neutral",
  isSectionBoundary: boolean,
) {
  if (direction === "back") {
    return {
      enterY: isSectionBoundary ? -24 : -12,
      duration: isSectionBoundary ? 0.4 : 0.25,
    };
  }

  if (direction === "forward") {
    return {
      enterY: isSectionBoundary ? 24 : 12,
      duration: isSectionBoundary ? 0.6 : 0.25,
    };
  }

  return {
    enterY: 8,
    duration: 0.2,
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
  const { direction, isSectionBoundary } = transitionState;
  const motionValues = getContentMotionValues(direction, isSectionBoundary);

  return (
    <>
      <SectionTransitionOverlay />
      <motion.div
        key={pathname}
        initial={{
          opacity: prefersReducedMotion ? 1 : 0,
          y: prefersReducedMotion ? 0 : motionValues.enterY,
        }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : motionValues.duration,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
