"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import type { CourseElement } from "@/schemas/courseSchema";
import { useCourseNavigation } from "@/lib/course/navigation-transition-context";
import { usePrefersReducedMotion } from "@/lib/course/use-prefers-reduced-motion";
import { useExerciseSessionOptional } from "@/lib/exercises/ExerciseSessionContext";
import { cn } from "@/lib/utils";

import { ELEMENT_TYPE_ICONS } from "./element-type-icons";

const SECTION_BADGE_VISIBLE_MS = 400;

type ExerciseActionBarInfoProps = {
  type: CourseElement["type"];
  title: string;
  sectionOrder: number;
  sectionTitle: string;
  hideOnMobile?: boolean;
};

export function ExerciseActionBarInfo({
  type,
  title,
  sectionOrder,
  sectionTitle,
  hideOnMobile = false,
}: ExerciseActionBarInfoProps) {
  const session = useExerciseSessionOptional();
  const { transitionState } = useCourseNavigation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const Icon = ELEMENT_TYPE_ICONS[type];
  const stageProgress = session?.stageProgress;
  const [showSectionBadge, setShowSectionBadge] = useState(false);

  useEffect(() => {
    const shouldShowBadge =
      transitionState.showSectionOverlay &&
      transitionState.boundaryKey.length > 0;

    if (!shouldShowBadge) {
      setShowSectionBadge(false);
      return;
    }

    setShowSectionBadge(true);

    const timeout = window.setTimeout(() => {
      setShowSectionBadge(false);
    }, SECTION_BADGE_VISIBLE_MS);

    return () => window.clearTimeout(timeout);
  }, [transitionState.boundaryKey, transitionState.showSectionOverlay]);

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 w-full",
        hideOnMobile && "hidden sm:flex",
      )}
    >
      <Icon className="size-5 shrink-0 text-primary" />
      <div className="min-w-0 w-full">
        <AnimatePresence mode="wait" initial={false}>
          {showSectionBadge ? (
            <motion.p
              key="section-badge"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="truncate text-sm font-medium text-primary"
            >
              Sekcja {sectionOrder} · {sectionTitle}
            </motion.p>
          ) : (
            <motion.p
              key="element-title"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="truncate text-sm font-medium text-foreground"
            >
              {title}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {stageProgress && (
        <motion.span
          key={`${stageProgress.current}-${stageProgress.total}`}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="hidden shrink-0 text-sm text-muted-foreground sm:inline"
        >
          {stageProgress.current}/{stageProgress.total}
        </motion.span>
      )}
    </div>
  );
}
