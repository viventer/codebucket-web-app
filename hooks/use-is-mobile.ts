"use client";

import { useEffect, useState } from "react";

/** True when the primary input cannot hover precisely (touch / coarse pointer). */
const TOUCH_QUERY = "(hover: none), (pointer: coarse)";

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(TOUCH_QUERY);
    const update = () => {
      setIsMobile(mediaQuery.matches);
    };

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isMobile;
}
