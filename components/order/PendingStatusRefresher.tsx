"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const REFRESH_DELAYS_MS = [4000, 10000] as const;

export function PendingStatusRefresher() {
  const router = useRouter();

  useEffect(() => {
    const timeouts = REFRESH_DELAYS_MS.map((delayMs) =>
      window.setTimeout(() => {
        router.refresh();
      }, delayMs),
    );

    return () => {
      for (const timeoutId of timeouts) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [router]);

  return null;
}
