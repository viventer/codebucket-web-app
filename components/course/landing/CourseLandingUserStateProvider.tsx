"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import {
  useResolveCourseLandingUserState,
  type ResolvedCourseLandingUserState,
} from "@/components/course/landing/useResolveCourseLandingUserState";
import type { CourseLandingSectionInput } from "@/lib/course/landing-user-state";

const CourseLandingUserStateContext =
  createContext<ResolvedCourseLandingUserState | null>(null);

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
  const value = useResolveCourseLandingUserState({
    courseId,
    isPresale,
    sections,
  });

  return (
    <CourseLandingUserStateContext.Provider value={value}>
      {children}
    </CourseLandingUserStateContext.Provider>
  );
}

export function useCourseLandingUserState(): ResolvedCourseLandingUserState {
  const value = useContext(CourseLandingUserStateContext);
  if (!value) {
    throw new Error(
      "useCourseLandingUserState must be used within CourseLandingUserStateProvider",
    );
  }
  return value;
}

export function useOptionalCourseLandingUserState(): ResolvedCourseLandingUserState | null {
  return useContext(CourseLandingUserStateContext);
}
