"use client";

import { useEffect, useState } from "react";

import { getCourseLandingState } from "@/actions/user/course-landing-state";
import {
  isGuestUser,
  readAllGuestProgress,
} from "@/lib/course/guest-progress";
import {
  deriveCourseLandingUserState,
  type CourseLandingSectionInput,
  type CourseLandingUserState,
} from "@/lib/course/landing-user-state";

type UseResolveCourseLandingUserStateArgs = {
  courseId: string;
  isPresale: boolean;
  sections: CourseLandingSectionInput[];
  /** When false, skip fetching and keep the default "none" state. */
  enabled?: boolean;
};

export type ResolvedCourseLandingUserState = {
  loading: boolean;
  state: CourseLandingUserState;
};

/**
 * Client-side ownership/progress resolution for course CTAs.
 * Shared by the landing provider and standalone primary CTA buttons.
 */
export function useResolveCourseLandingUserState({
  courseId,
  isPresale,
  sections,
  enabled = true,
}: UseResolveCourseLandingUserStateArgs): ResolvedCourseLandingUserState {
  const [loading, setLoading] = useState(enabled);
  const [state, setState] = useState<CourseLandingUserState>({ status: "none" });

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setState({ status: "none" });
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function resolveState() {
      try {
        if (isGuestUser()) {
          const entry = readAllGuestProgress()[courseId];
          const elementsCompleted = entry?.elementsCompleted ?? [];
          const unlocked =
            entry?.startedAt !== undefined || elementsCompleted.length > 0;

          if (!cancelled) {
            setState(
              deriveCourseLandingUserState({
                sections,
                elementsCompleted,
                unlocked,
                isPresale,
              }),
            );
          }
          return;
        }

        const result = await getCourseLandingState({ courseId });
        if (cancelled) return;

        if (!result.success) {
          setState({ status: "none" });
          return;
        }

        setState(
          deriveCourseLandingUserState({
            sections,
            elementsCompleted: result.elementsCompleted,
            unlocked: result.unlocked,
            isPresale,
          }),
        );
      } catch {
        if (!cancelled) {
          setState({ status: "none" });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void resolveState();

    return () => {
      cancelled = true;
    };
  }, [courseId, enabled, isPresale, sections]);

  return { loading, state };
}
