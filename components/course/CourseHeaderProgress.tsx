"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { useCourseNavigation } from "@/lib/course/navigation-transition-context";
import { usePrefersReducedMotion } from "@/lib/course/use-prefers-reduced-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type CourseHeaderProgressProps = {
  value: number;
  completed: number;
  total: number;
};

export function CourseHeaderProgress({
  value,
  completed,
  total,
}: CourseHeaderProgressProps) {
  const { transitionState } = useCourseNavigation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    if (
      !transitionState.showSectionOverlay ||
      transitionState.boundaryKey.length === 0
    ) {
      setPulseActive(false);
      return;
    }

    setPulseActive(true);

    const timeout = window.setTimeout(() => {
      setPulseActive(false);
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [transitionState.boundaryKey, transitionState.showSectionOverlay]);

  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={
          pulseActive && !prefersReducedMotion
            ? {
                scale: [1, 1.06, 1],
                boxShadow: [
                  "0 0 0 0 transparent",
                  "0 0 0 4px color-mix(in oklab, var(--primary) 25%, transparent)",
                  "0 0 0 0 transparent",
                ],
              }
            : { scale: 1, boxShadow: "0 0 0 0 transparent" }
        }
        transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: "easeOut" }}
        className={cn("rounded-full p-0.5", pulseActive && "bg-primary/5")}
      >
        <Progress value={value} className="w-24" />
      </motion.div>
      <span className="hidden text-xs whitespace-nowrap text-muted-foreground sm:block">
        {completed} / {total}
      </span>
    </div>
  );
}
