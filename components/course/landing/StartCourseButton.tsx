"use client";

import { useRouter } from "next/navigation";
import { RocketIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { startCourse } from "@/actions/user/start-course";
import { isGuestUser, writeGuestCourseStarted } from "@/lib/course/guest-progress";

type StartCourseButtonProps = {
  courseId: string;
  startHref: string;
  label: string;
  isFree?: boolean;
  size?: "default" | "lg";
  className?: string;
};

export function StartCourseButton({
  courseId,
  startHref,
  label,
  isFree = false,
  size = "lg",
  className,
}: StartCourseButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      // Free courses: guests can start the first section without an account
      if (isFree && isGuestUser()) {
        writeGuestCourseStarted(courseId);
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

      router.push(startHref);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size={size} className={className} onClick={handleClick} disabled={loading}>
      <RocketIcon />
      {label}
    </Button>
  );
}
