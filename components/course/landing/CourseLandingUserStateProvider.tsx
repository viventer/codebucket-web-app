"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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

type CourseLandingUserStateContextValue = {
  loading: boolean;
  state: CourseLandingUserState;
};

const CourseLandingUserStateContext =
  createContext<CourseLandingUserStateContextValue | null>(null);

type CourseLandingUserStateProviderProps = {
  courseId: string;
  isPresale: boolean;
  sections: CourseLandingSectionInput[];
  children: ReactNode;
};

export function CourseLandingUserStateProvider({
  courseId,
  isPresale,
  sections,
  children,
}: CourseLandingUserStateProviderProps) {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<CourseLandingUserState>({ status: "none" });

  useEffect(() => {
    let cancelled = false;

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
  }, [courseId, isPresale, sections]);

  return (
    <CourseLandingUserStateContext.Provider value={{ loading, state }}>
      {children}
    </CourseLandingUserStateContext.Provider>
  );
}

export function useCourseLandingUserState(): CourseLandingUserStateContextValue {
  const value = useContext(CourseLandingUserStateContext);
  if (!value) {
    throw new Error(
      "useCourseLandingUserState must be used within CourseLandingUserStateProvider",
    );
  }
  return value;
}
