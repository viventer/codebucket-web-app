"use client";

import type { ReactNode } from "react";

import type { CourseNavigationMetadata } from "@/lib/course/navigation-transition-types";
import { CourseNavigationProvider } from "@/lib/course/navigation-transition-context";
import { ExerciseSessionProvider } from "@/lib/exercises/ExerciseSessionContext";
import type { CourseElement } from "@/schemas/courseSchema";
import { CourseHeader, type CourseHeaderProps } from "@/components/course/CourseHeader";
import { SectionTransitionOverlay } from "@/components/course/SectionTransitionOverlay";
import {
  ElementActionBar,
  type ElementActionBarProps,
} from "@/components/course/element-action-bar";

type CourseElementShellProps = {
  navigationMetadata: CourseNavigationMetadata;
  headerProps: CourseHeaderProps;
  actionBarProps: ElementActionBarProps;
  isExercise: boolean;
  exerciseElement: CourseElement;
  children: ReactNode;
};

export function CourseElementShell({
  navigationMetadata,
  headerProps,
  actionBarProps,
  isExercise,
  exerciseElement,
  children,
}: CourseElementShellProps) {
  const body = (
    <>
      <main className="mx-auto mt-8 w-[90vw] max-w-[1280px] flex-1 pb-28 sm:mt-16">
        {children}
      </main>
      <ElementActionBar {...actionBarProps} />
    </>
  );

  return (
    <CourseNavigationProvider metadata={navigationMetadata}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SectionTransitionOverlay />
        <CourseHeader {...headerProps} />
        {isExercise ? (
          <ExerciseSessionProvider element={exerciseElement}>
            {body}
          </ExerciseSessionProvider>
        ) : (
          body
        )}
      </div>
    </CourseNavigationProvider>
  );
}
