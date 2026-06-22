"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { useCourseNavigation } from "@/lib/course/navigation-transition-context";
import { usePrefersReducedMotion } from "@/lib/course/use-prefers-reduced-motion";

const OVERLAY_VISIBLE_MS = 800;

export function SectionTransitionOverlay() {
  const { transitionState } = useCourseNavigation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!transitionState.showSectionOverlay || prefersReducedMotion) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, OVERLAY_VISIBLE_MS);

    return () => window.clearTimeout(timeout);
  }, [
    prefersReducedMotion,
    transitionState.boundaryKey,
    transitionState.showSectionOverlay,
  ]);

  if (!visible) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionState.boundaryKey}
        className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="rounded-2xl border bg-background/95 px-8 py-6 text-center shadow-lg backdrop-blur-sm"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Sekcja {transitionState.sectionOverlayOrder}
          </p>
          <p className="mt-2 text-xl font-semibold text-foreground">
            {transitionState.sectionOverlayTitle}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
