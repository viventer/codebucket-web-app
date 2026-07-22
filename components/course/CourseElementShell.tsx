"use client";

import type { ReactNode } from "react";

import type { CourseElement } from "@/schemas/courseSchema";
import type { CourseNavigationMetadata } from "@/lib/course/navigation-transition-types";
import { CourseNavigationProvider } from "@/lib/course/navigation-transition-context";
import { CheatsheetFullscreenProvider } from "@/lib/course/cheatsheet-fullscreen-context";
import { ExerciseSessionProvider } from "@/lib/exercises/session/ExerciseSessionContext";
import {
  CourseProgressProvider,
  useCourseProgress,
} from "@/lib/course/course-progress-context";
import { getSectionProgress } from "@/lib/course/progress";
import {
  CourseHeader,
  type CourseHeaderProps,
} from "@/components/course/CourseHeader";
import { CourseTransitionOverlay } from "@/components/course/CourseTransitionOverlay";
import { ElementActionBar } from "@/components/course/element-action-bar/ElementActionBar";
import type { ElementActionBarProps } from "@/components/course/element-action-bar/types";
import type { NavSection } from "@/components/course/CourseNavSheet";
import { cn } from "@/lib/utils";

/** Section/element structure without completion state — sourced from static layout */
export type StaticNavElement = {
  id: string;
  title: string;
  type: CourseElement["type"];
};

export type StaticNavSection = {
  id: string;
  title: string;
  order: number;
  elements: StaticNavElement[];
};

type HeaderStaticProps = Omit<CourseHeaderProps, "sections" | "progress">;

type CourseElementShellProps = {
  courseId: string;
  navigationMetadata: CourseNavigationMetadata;
  staticSections: StaticNavSection[];
  /** Ordered element IDs in the current section — used for the progress bar */
  currentSectionElementIds: string[];
  headerStaticProps: HeaderStaticProps;
  actionBarProps: ElementActionBarProps;
  isExercise: boolean;
  exerciseElement: CourseElement;
  centerContentOnMobile?: boolean;
  children: ReactNode;
};

export function CourseElementShell({
  courseId,
  navigationMetadata,
  staticSections,
  currentSectionElementIds,
  headerStaticProps,
  actionBarProps,
  isExercise,
  exerciseElement,
  centerContentOnMobile = false,
  children,
}: CourseElementShellProps) {
  const sectionSpecs = staticSections.map((s) => ({
    id: s.id,
    elementIds: s.elements.map((el) => el.id),
  }));

  return (
    <CourseProgressProvider courseId={courseId} sections={sectionSpecs}>
      <CourseShellContent
        navigationMetadata={navigationMetadata}
        staticSections={staticSections}
        currentSectionElementIds={currentSectionElementIds}
        headerStaticProps={headerStaticProps}
        actionBarProps={actionBarProps}
        isExercise={isExercise}
        exerciseElement={exerciseElement}
        centerContentOnMobile={centerContentOnMobile}
      >
        {children}
      </CourseShellContent>
    </CourseProgressProvider>
  );
}

type CourseShellContentProps = Omit<CourseElementShellProps, "courseId">;

function CourseShellContent({
  navigationMetadata,
  staticSections,
  currentSectionElementIds,
  headerStaticProps,
  actionBarProps,
  isExercise,
  exerciseElement,
  centerContentOnMobile,
  children,
}: CourseShellContentProps) {
  const { completedElementIds, sectionsCompleted } = useCourseProgress();

  // Enrich static sections with live completion flags
  const liveSections: NavSection[] = staticSections.map((section) => ({
    ...section,
    elements: section.elements.map((el) => ({
      ...el,
      completed: completedElementIds.has(el.id),
    })),
  }));

  const progress = getSectionProgress(
    currentSectionElementIds,
    completedElementIds,
  );

  const elementsCompleted = Array.from(completedElementIds);

  const body = (
    <>
      <main
        className={cn(
          "mx-auto w-[90vw] max-w-[90vw] lg:max-w-7xl flex-1 pb-28",
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
        <CourseHeader
          {...headerStaticProps}
          sections={liveSections}
          progress={progress}
        />
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
