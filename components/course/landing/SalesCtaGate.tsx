"use client";

import type { ReactNode } from "react";

import { useCourseLandingUserState } from "@/components/course/landing/CourseLandingUserStateProvider";
import { isOwnedLandingStatus } from "@/lib/course/landing-user-state";

type SalesCtaGateProps = {
  children: ReactNode;
};

/** Hides sales CTAs once the user owns the course. */
export function SalesCtaGate({ children }: SalesCtaGateProps) {
  const { loading, state } = useCourseLandingUserState();

  if (!loading && isOwnedLandingStatus(state.status)) {
    return null;
  }

  return children;
}
