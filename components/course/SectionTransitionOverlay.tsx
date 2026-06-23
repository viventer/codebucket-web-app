"use client";

import { AnimatePresence, motion } from "motion/react";
import { PartyPopperIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useCourseNavigation } from "@/lib/course/navigation-transition-context";
import { usePrefersReducedMotion } from "@/lib/course/use-prefers-reduced-motion";

export const SECTION_OVERLAY_VISIBLE_MS = 2500;
export const SECTION_OVERLAY_EXIT_MS = 300;

type OverlaySnapshot = {
  boundaryKey: string;
  completedSectionTitle: string;
  sectionOverlayOrder: number;
  sectionOverlayTitle: string;
};

export function SectionTransitionOverlay() {
  const { transitionState } = useCourseNavigation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [snapshot, setSnapshot] = useState<OverlaySnapshot | null>(null);

  useEffect(() => {
    if (
      !transitionState.showSectionOverlay ||
      transitionState.boundaryKey.length === 0
    ) {
      return;
    }

    setSnapshot({
      boundaryKey: transitionState.boundaryKey,
      completedSectionTitle: transitionState.completedSectionTitle,
      sectionOverlayOrder: transitionState.sectionOverlayOrder,
      sectionOverlayTitle: transitionState.sectionOverlayTitle,
    });
  }, [
    transitionState.boundaryKey,
    transitionState.completedSectionTitle,
    transitionState.sectionOverlayOrder,
    transitionState.sectionOverlayTitle,
    transitionState.showSectionOverlay,
  ]);

  useEffect(() => {
    if (!snapshot) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSnapshot(null);
    }, SECTION_OVERLAY_VISIBLE_MS);

    return () => window.clearTimeout(timeout);
  }, [snapshot]);

  const backdropTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: SECTION_OVERLAY_EXIT_MS / 1000 };
  const cardTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: SECTION_OVERLAY_EXIT_MS / 1000, ease: "easeOut" as const };

  return (
    <AnimatePresence initial={false}>
      {snapshot && (
        <motion.div
          key={snapshot.boundaryKey}
          className="pointer-events-none fixed inset-0 z-60 flex items-center justify-center bg-background/60 backdrop-blur-sm"
          initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={backdropTransition}
        >
          <motion.div
            className="mx-4 w-full max-w-md rounded-2xl border bg-background px-8 py-7 text-center shadow-xl"
            initial={{
              opacity: prefersReducedMotion ? 1 : 0,
              y: prefersReducedMotion ? 0 : 24,
              scale: prefersReducedMotion ? 1 : 0.94,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: prefersReducedMotion ? 0 : -16,
              scale: prefersReducedMotion ? 1 : 0.96,
            }}
            transition={cardTransition}
          >
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-feedback-success/15">
              <PartyPopperIcon className="size-7 text-feedback-success" />
            </div>
            <p className="text-xl font-semibold text-foreground">Gratulacje!</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Ukończyłeś sekcję{" "}
              <span className="font-medium text-foreground">
                {snapshot.completedSectionTitle}
              </span>
            </p>
            <div className="mt-6 border-t pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Następna sekcja
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Sekcja {snapshot.sectionOverlayOrder}
              </p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {snapshot.sectionOverlayTitle}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
