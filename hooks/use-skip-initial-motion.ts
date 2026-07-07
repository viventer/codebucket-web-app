"use client";

import { useEffect, useRef } from "react";

/**
 * True on SSR and the first client render so motion `initial` can be `false`
 * and match server HTML. After mount, returns false so route changes animate.
 */
export function useSkipInitialMotion(): boolean {
  const skipRef = useRef(true);

  useEffect(() => {
    skipRef.current = false;
  }, []);

  return skipRef.current;
}
