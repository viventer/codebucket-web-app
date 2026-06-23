"use client";

import { AnimatePresence, motion } from "motion/react";
import { PartyPopperIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCourseNavigation } from "@/lib/course/navigation-transition-context";
import { usePrefersReducedMotion } from "@/lib/course/use-prefers-reduced-motion";

const MotionCard = motion.create(Card);

export const SECTION_OVERLAY_VISIBLE_MS = 3000;
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
            <CardContent className="p-8 flex flex-col gap-4">
              <div className="flex items-center gap-3 w-full justify-center">
                <PartyPopperIcon className="size-7 text-feedback-success" />
                <p className="text-lg font-bold text-foreground">Gratulacje!</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Ukończyłeś sekcję{" "}
                <span className="font-mediumi text-foreground">
                  {snapshot.completedSectionTitle}
                </span>
              </p>
            </CardContent>
            <CardFooter className="flex-col items-center  p-8 gap-1">
              <p className="text-sm text-muted-foreground">Następna sekcja</p>
              <p className="text-lg font-bold text-foreground">
                {snapshot.sectionOverlayTitle}
              </p>
            </CardFooter>
          </MotionCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
