"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ClientIcon } from "@/components/ui/client-icon";
import { useCourseNavigation } from "@/lib/course/navigation-transition-context";
import type { TransitionOverlayVariant } from "@/lib/course/navigation-transition-types";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const MotionCard = motion.create(Card);

export const TRANSITION_OVERLAY_VISIBLE_MS = 2000;
export const TRANSITION_OVERLAY_EXIT_MS = 300;

type OverlaySnapshot = {
  boundaryKey: string;
  variant: TransitionOverlayVariant;
  completedTitle: string;
  nextTitle: string;
};

const OVERLAY_COPY: Record<
  TransitionOverlayVariant,
  { completedLabel: string; nextLabel: string }
> = {
  section: {
    completedLabel: "Ukończyłeś sekcję",
    nextLabel: "Następna sekcja",
  },
  exercise: {
    completedLabel: "Ukończyłeś ćwiczenie",
    nextLabel: "Następny rozdział",
  },
};

export function CourseTransitionOverlay() {
  const { transitionState } = useCourseNavigation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [snapshot, setSnapshot] = useState<OverlaySnapshot | null>(null);

  useEffect(() => {
    if (
      !transitionState.showTransitionOverlay ||
      transitionState.boundaryKey.length === 0 ||
      transitionState.overlayVariant === null
    ) {
      return;
    }

    setSnapshot({
      boundaryKey: transitionState.boundaryKey,
      variant: transitionState.overlayVariant,
      completedTitle: transitionState.overlayCompletedTitle,
      nextTitle: transitionState.overlayNextTitle,
    });
  }, [
    transitionState.boundaryKey,
    transitionState.overlayCompletedTitle,
    transitionState.overlayNextTitle,
    transitionState.overlayVariant,
    transitionState.showTransitionOverlay,
  ]);

  useEffect(() => {
    if (!snapshot) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSnapshot(null);
    }, TRANSITION_OVERLAY_VISIBLE_MS);

    return () => window.clearTimeout(timeout);
  }, [snapshot]);

  const backdropTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: TRANSITION_OVERLAY_EXIT_MS / 1000 };
  const cardTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: TRANSITION_OVERLAY_EXIT_MS / 1000, ease: "easeOut" as const };

  const copy = snapshot ? OVERLAY_COPY[snapshot.variant] : null;

  return (
    <AnimatePresence initial={false}>
      {snapshot && copy && (
        <motion.div
          key={snapshot.boundaryKey}
          className="pointer-events-none fixed inset-0 z-60 flex items-center justify-center bg-background/60 backdrop-blur-sm"
          initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={backdropTransition}
        >
          <MotionCard
            className="mx-4 w-full max-w-md gap-0 rounded-2xl bg-background py-0 text-center shadow-xl"
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
            <CardContent className="flex flex-col gap-4 p-8">
              <div className="flex w-full items-center justify-center gap-3">
                <ClientIcon
                  src="confetti.svg"
                  size={28}
                  className="text-feedback-success"
                />
                <p className="text-lg font-bold text-foreground">Gratulacje!</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {copy.completedLabel}{" "}
                <span className="font-medium text-foreground">
                  {snapshot.completedTitle}
                </span>
              </p>
            </CardContent>
            <CardFooter className="flex-col items-center gap-1 p-8">
              <p className="text-sm text-muted-foreground">{copy.nextLabel}</p>
              <p className="text-lg font-bold text-foreground">
                {snapshot.nextTitle}
              </p>
            </CardFooter>
          </MotionCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
