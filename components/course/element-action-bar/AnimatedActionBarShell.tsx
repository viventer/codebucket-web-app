"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { useCourseNavigation } from "@/lib/course/navigation-transition-context";
import { usePrefersReducedMotion } from "@/lib/course/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type AnimatedActionBarContentProps = {
  children: ReactNode;
  contentKey: string;
  direction: "forward" | "back" | "neutral";
  fullWidth?: boolean;
};

function AnimatedActionBarContent({
  children,
  contentKey,
  direction,
  fullWidth = false,
}: AnimatedActionBarContentProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const enterX = direction === "forward" ? 8 : direction === "back" ? -8 : 0;

  return (
    <motion.div
      key={contentKey}
      initial={{
        opacity: prefersReducedMotion ? 1 : 0,
        x: prefersReducedMotion ? 0 : enterX,
      }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.25,
        ease: "easeOut",
      }}
      className={cn("min-w-0", fullWidth && "w-full sm:w-auto")}
    >
      {children}
    </motion.div>
  );
}

type AnimatedActionBarShellProps = {
  info: ReactNode;
  actions: ReactNode;
  infoKey: string;
  actionsKey: string;
  hideInfoOnMobile?: boolean;
};

export function AnimatedActionBarShell({
  info,
  actions,
  infoKey,
  actionsKey,
  hideInfoOnMobile = false,
}: AnimatedActionBarShellProps) {
  const { transitionState } = useCourseNavigation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [borderPulse, setBorderPulse] = useState(false);
  const { direction, showSectionOverlay, boundaryKey } = transitionState;

  useEffect(() => {
    if (!showSectionOverlay || boundaryKey.length === 0) {
      setBorderPulse(false);
      return;
    }

    setBorderPulse(true);

    const timeout = window.setTimeout(() => {
      setBorderPulse(false);
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [boundaryKey, showSectionOverlay]);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-4">
      <motion.div
        animate={
          borderPulse && !prefersReducedMotion
            ? {
                boxShadow: [
                  "0 0 0 0 transparent",
                  "0 0 0 2px color-mix(in oklab, var(--primary) 40%, transparent)",
                  "0 0 0 0 transparent",
                ],
              }
            : { boxShadow: "0 0 0 0 transparent" }
        }
        transition={{
          duration: prefersReducedMotion ? 0 : 0.8,
          ease: "easeOut",
        }}
        className={cn(
          "mx-auto flex w-[90vw] max-w-[1280px] items-center justify-between rounded-xl border bg-background/70 px-4! py-3 backdrop-blur",
          borderPulse && "border-primary/40",
        )}
      >
        <AnimatedActionBarContent contentKey={infoKey} direction={direction}>
          {info}
        </AnimatedActionBarContent>
        <AnimatedActionBarContent
          contentKey={actionsKey}
          direction={direction}
          fullWidth={hideInfoOnMobile}
        >
          {actions}
        </AnimatedActionBarContent>
      </motion.div>
    </nav>
  );
}

export function useActionBarContentKeys(type: string, title: string) {
  const pathname = usePathname();

  return {
    infoKey: `${pathname}-${type}-${title}`,
    actionsKey: `${pathname}-${type}-actions`,
  };
}
