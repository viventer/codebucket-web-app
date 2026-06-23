"use client";

import { AnimatePresence, motion } from "motion/react";
import { PartyPopperIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useCourseNavigation } from "@/lib/course/navigation-transition-context";
import { usePrefersReducedMotion } from "@/lib/course/use-prefers-reduced-motion";

const OVERLAY_VISIBLE_MS = 2500;

export function SectionTransitionOverlay() {
  const { transitionState } = useCourseNavigation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [dismissedBoundaryKey, setDismissedBoundaryKey] = useState<
    string | null
  >(null);

  const shouldShow =
    transitionState.showSectionOverlay &&
    transitionState.boundaryKey.length > 0 &&
    dismissedBoundaryKey !== transitionState.boundaryKey;

  useEffect(() => {
    if (!shouldShow) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setDismissedBoundaryKey(transitionState.boundaryKey);
    }, OVERLAY_VISIBLE_MS);

    return () => window.clearTimeout(timeout);
  }, [shouldShow, transitionState.boundaryKey]);

  if (!shouldShow) {
    return null;
  }

  const backdropTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.2 };
  const cardTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: "easeOut" as const };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionState.boundaryKey}
        className="pointer-events-none fixed inset-0 z-60 flex items-center justify-center bg-background/60 backdrop-blur-sm"
        initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
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
            opacity: prefersReducedMotion ? 1 : 0,
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
              {transitionState.completedSectionTitle}
            </span>
          </p>
          <div className="mt-6 border-t pt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Następna sekcja
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sekcja {transitionState.sectionOverlayOrder}
            </p>
            <p className="mt-1 text-xl font-semibold text-foreground">
              {transitionState.sectionOverlayTitle}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
