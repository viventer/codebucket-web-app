"use client";

import { useEffect } from "react";

const CELEBRATION_MS = 1500;

export function useCelebrationAutoDismiss(
  showCelebration: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!showCelebration) {
      return;
    }

    const timeout = window.setTimeout(onDismiss, CELEBRATION_MS);

    return () => window.clearTimeout(timeout);
  }, [showCelebration, onDismiss]);
}
