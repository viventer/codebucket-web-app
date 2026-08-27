"use client";

import { logEvent } from "firebase/analytics";
import { useEffect } from "react";

import { analytics } from "@/firebase/init";

type OpenCourseTrackerProps = {
  courseId: string;
};

const STORAGE_PREFIX = "cb_open_course:";

export function OpenCourseTracker({ courseId }: OpenCourseTrackerProps) {
  useEffect(() => {
    const key = `${STORAGE_PREFIX}${courseId}`;
    try {
      if (sessionStorage.getItem(key)) {
        return;
      }
      sessionStorage.setItem(key, "1");
    } catch {
      // Still fire once per mount if sessionStorage is unavailable.
    }

    if (analytics) {
      logEvent(analytics, "open_course", { course_id: courseId });
    }
  }, [courseId]);

  return null;
}
