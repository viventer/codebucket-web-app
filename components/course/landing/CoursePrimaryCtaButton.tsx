"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useOptionalCourseLandingUserState } from "@/components/course/landing/CourseLandingUserStateProvider";
import { PresaleCtaButton } from "@/components/course/landing/PresaleCtaButton";
import { StartCourseButton } from "@/components/course/landing/StartCourseButton";
import { useResolveCourseLandingUserState } from "@/components/course/landing/useResolveCourseLandingUserState";
import { Button } from "@/components/ui/button";
import { ClientIcon } from "@/components/ui/client-icon";
import { Skeleton } from "@/components/ui/skeleton";
import type { CourseLandingSectionInput } from "@/lib/course/landing-user-state";
import { cn } from "@/lib/utils";

const EMPTY_SECTIONS: CourseLandingSectionInput[] = [];

type CoursePrimaryCtaButtonProps = {
  courseId: string;
  startHref: string | null;
  label: string;
  isFree: boolean;
  isPresale: boolean;
  /**
   * Required outside CourseLandingUserStateProvider so ownership/progress
   * (and resume href) can be resolved on the client.
   */
  sections?: CourseLandingSectionInput[];
  size?: "default" | "lg";
  className?: string;
};

/**
 * Primary course CTA shared by the course landing hero and home course cards.
 * Swaps label/href based on ownership and progress; falls back to start/presale.
 */
export function CoursePrimaryCtaButton({
  courseId,
  startHref,
  label,
  isFree,
  isPresale,
  sections = EMPTY_SECTIONS,
  size = "lg",
  className,
}: CoursePrimaryCtaButtonProps) {
  const fromProvider = useOptionalCourseLandingUserState();
  const standalone = useResolveCourseLandingUserState({
    courseId,
    isPresale,
    sections,
    enabled: fromProvider === null,
  });
  const { loading, state } = fromProvider ?? standalone;

  if (loading) {
    return <Skeleton className={cn("h-11 w-full rounded-md", className)} />;
  }

  let button: ReactNode = null;

  if (state.status === "owned-presale") {
    button = (
      <Button
        size={size}
        disabled
        className={cn(
          "gap-2 [&_svg]:pointer-events-auto! [&_svg:not([class*='size-'])]:size-auto",
          className,
        )}
      >
        <ClientIcon src="rocket.svg" size={24} />
        {state.buttonLabel}
      </Button>
    );
  } else if (state.status === "in-progress" || state.status === "completed") {
    button = (
      <Button
        asChild
        size={size}
        className={cn(
          "gap-2 [&_svg]:pointer-events-auto! [&_svg:not([class*='size-'])]:size-auto",
          className,
        )}
      >
        <Link href={state.resumeHref}>
          <ClientIcon src="rocket.svg" size={24} />
          {state.buttonLabel}
        </Link>
      </Button>
    );
  } else if (isPresale) {
    button = (
      <PresaleCtaButton
        courseId={courseId}
        label={label}
        size={size}
        className={className}
      />
    );
  } else if (startHref) {
    button = (
      <StartCourseButton
        courseId={courseId}
        startHref={startHref}
        label={label}
        isFree={isFree}
        size={size}
        className={className}
      />
    );
  }

  return button;
}
