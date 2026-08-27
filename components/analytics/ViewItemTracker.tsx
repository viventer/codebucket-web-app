"use client";

import { logEvent } from "firebase/analytics";
import { useEffect } from "react";

import { analytics } from "@/firebase/init";

type ViewItemTrackerProps = {
  itemId: string;
  itemName: string;
  value?: number;
  currency?: string;
};

export function ViewItemTracker({
  itemId,
  itemName,
  value,
  currency,
}: ViewItemTrackerProps) {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, "view_item", {
        item_id: itemId,
        item_name: itemName,
        value,
        currency,
      });
    }
  }, [itemId, itemName, value, currency]);

  return null;
}
