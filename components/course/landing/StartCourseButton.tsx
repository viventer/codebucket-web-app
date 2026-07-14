"use client";

import { useRouter } from "next/navigation";
import { RocketIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { startCourse } from "@/actions/user/start-course";

type StartCourseButtonProps = {
  courseId: string;
  startHref: string;
  label: string;
  size?: "default" | "lg";
  className?: string;
};

export function StartCourseButton({
  courseId,
  startHref,
  label,
  size = "lg",
  className,
}: StartCourseButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
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
