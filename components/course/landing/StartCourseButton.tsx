"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ClientIcon } from "@/components/ui/client-icon";
import { logEvent } from "firebase/analytics";

import { startCourse } from "@/actions/user/start-course";
import { analytics } from "@/firebase/init";
import { isGuestUser, writeGuestCourseStarted } from "@/lib/course/guest-progress";
import { cn } from "@/lib/utils";

type StartCourseButtonProps = {
  courseId: string;
  startHref: string;
  label: string;
  isFree?: boolean;
  size?: "default" | "lg";
  className?: string;
  showIcon?: boolean;
};

export function StartCourseButton({
  courseId,
  startHref,
  label,
  isFree = false,
  size = "lg",
  className,
  showIcon = true,
}: StartCourseButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      // Free courses: guests can start the first section without an account
      if (isFree && isGuestUser()) {
        writeGuestCourseStarted(courseId);
        if (analytics) {
          logEvent(analytics, "start_course", { course_id: courseId });
        }
        router.push(startHref);
        return;
      }

      const result = await startCourse(courseId);

      if (!result.success) {
        if ("needsAuth" in result && result.needsAuth) {
          router.push(`/login?next=${encodeURIComponent(startHref)}`);
        }
        return;
      }

      if (analytics) {
        logEvent(analytics, "start_course", { course_id: courseId });
      }
      router.push(startHref);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size={size}
      className={cn(
        "gap-2 [&_svg]:pointer-events-auto! [&_svg:not([class*='size-'])]:size-auto",
        className,
      )}
      onClick={handleClick}
      disabled={loading}
    >
      {showIcon ? <ClientIcon src="rocket.svg" size={24} /> : null}
      {label}
    </Button>
  );
}
