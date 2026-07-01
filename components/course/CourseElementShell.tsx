"use client";

import type { ReactNode } from "react";

import type { CourseNavigationMetadata } from "@/lib/course/navigation-transition-types";
import { CourseNavigationProvider } from "@/lib/course/navigation-transition-context";
import { CheatsheetFullscreenProvider } from "@/lib/course/cheatsheet-fullscreen-context";
import { ExerciseSessionProvider } from "@/lib/exercises/session/ExerciseSessionContext";
import type { CourseElement } from "@/schemas/courseSchema";
import {
  CourseHeader,
  type CourseHeaderProps,
} from "@/components/course/CourseHeader";
import { CourseTransitionOverlay } from "@/components/course/CourseTransitionOverlay";
import {
  ElementActionBar,
  type ElementActionBarProps,
} from "@/components/course/element-action-bar";
import { cn } from "@/lib/utils";

type CourseElementShellProps = {
  navigationMetadata: CourseNavigationMetadata;
  sectionsCompleted: string[];
  elementsCompleted: string[];
  headerProps: CourseHeaderProps;
  actionBarProps: ElementActionBarProps;
  isExercise: boolean;
  exerciseElement: CourseElement;
  centerContentOnMobile?: boolean;
  children: ReactNode;
};

export function CourseElementShell({
  navigationMetadata,
  sectionsCompleted,
  elementsCompleted,
  headerProps,
  actionBarProps,
  isExercise,
  exerciseElement,
  centerContentOnMobile = false,
  children,
}: CourseElementShellProps) {
  const body = (
    <>
      <main
        className={cn(
          "mx-auto w-[90vw] max-w-[90vw] lg:max-w-[1280px] flex-1 pb-28",
          centerContentOnMobile
            ? "max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:mt-0 sm:mt-16"
            : "mt-8 sm:mt-16",
        )}
      >
        {children}
      </main>
      <ElementActionBar {...actionBarProps} />
    </>
  );

  const isCheatsheet = actionBarProps.type === "cheatsheet";

  const wrappedBody = isCheatsheet ? (
    <CheatsheetFullscreenProvider>{body}</CheatsheetFullscreenProvider>
  ) : (
    body
  );

  return (
    <CourseNavigationProvider
      metadata={navigationMetadata}
      sectionsCompleted={sectionsCompleted}
      elementsCompleted={elementsCompleted}
    >
      <div className="flex min-h-dvh flex-col bg-background text-foreground">
        <CourseTransitionOverlay />
        <CourseHeader {...headerProps} />
        {isExercise ? (
          <ExerciseSessionProvider element={exerciseElement}>
            {wrappedBody}
          </ExerciseSessionProvider>
        ) : (
          wrappedBody
        )}
      </div>
    </CourseNavigationProvider>
  );
}
