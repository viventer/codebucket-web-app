"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  getCourseProgress,
  updateCourseProgress,
} from "@/actions/user/progress";
import { logEvent } from "firebase/analytics";

import { analytics } from "@/firebase/init";
import {
  isGuestUser,
  readGuestProgress,
  writeGuestElementCompleted,
  computeSectionsCompleted,
} from "@/lib/course/guest-progress";

type CourseProgressContextValue = {
  /** IDs of all completed elements for this course */
  completedElementIds: Set<string>;
  /** IDs of all completed sections for this course */
  sectionsCompleted: string[];
  /** Optimistically marks an element completed and persists to Firestore or localStorage */
  markElementCompleted: (elementId: string) => void;
};

const CourseProgressContext =
  createContext<CourseProgressContextValue | null>(null);

type SectionSpec = { id: string; elementIds: string[] };

function emitCompletionEvents(
  courseId: string,
  previousSectionIds: string[],
  nextSectionIds: string[],
  sections: SectionSpec[],
) {
  const previous = new Set(previousSectionIds);
  for (const sectionId of nextSectionIds) {
    if (!previous.has(sectionId) && analytics) {
      logEvent(analytics, "complete_chapter", {
        course_id: courseId,
        section_id: sectionId,
      });
    }
  }

  const allComplete =
    sections.length > 0 &&
    sections.every((section) => nextSectionIds.includes(section.id));
  const wasComplete =
    sections.length > 0 &&
    sections.every((section) => previousSectionIds.includes(section.id));

  if (allComplete && !wasComplete && analytics) {
    logEvent(analytics, "complete_course", { course_id: courseId });
  }
}

type CourseProgressProviderProps = {
  courseId: string;
  /** Ordered sections with their element IDs — used for client-side section completion when guest */
  sections: SectionSpec[];
  children: ReactNode;
};

export function CourseProgressProvider({
  courseId,
  sections,
  children,
}: CourseProgressProviderProps) {
  const [completedElementIds, setCompletedElementIds] = useState<Set<string>>(
    new Set(),
  );
  const [sectionsCompleted, setSectionsCompleted] = useState<string[]>([]);

  // Track in-flight persists to handle rollback on failure (authenticated path only)
  const pendingRef = useRef<Set<string>>(new Set());
  const sectionsCompletedRef = useRef<string[]>([]);

  useEffect(() => {
    sectionsCompletedRef.current = sectionsCompleted;
  }, [sectionsCompleted]);

  useEffect(() => {
    if (isGuestUser()) {
      const ids = new Set(readGuestProgress(courseId));
      const nextSections = computeSectionsCompleted(sections, ids);
      setCompletedElementIds(ids);
      sectionsCompletedRef.current = nextSections;
      setSectionsCompleted(nextSections);
    } else {
      getCourseProgress(courseId).then((result) => {
        if (result.success) {
          setCompletedElementIds(new Set(result.entry.elementsCompleted));
          sectionsCompletedRef.current = result.entry.sectionsCompleted;
          setSectionsCompleted(result.entry.sectionsCompleted);
        }
      });
    }
  }, [courseId]);

  const markElementCompleted = useCallback(
    (elementId: string) => {
      if (
        completedElementIds.has(elementId) ||
        pendingRef.current.has(elementId)
      ) {
        return;
      }

      if (isGuestUser()) {
        writeGuestElementCompleted(courseId, elementId);
        const next = new Set([...completedElementIds, elementId]);
        const nextSections = computeSectionsCompleted(sections, next);
        emitCompletionEvents(
          courseId,
          sectionsCompletedRef.current,
          nextSections,
          sections,
        );
        sectionsCompletedRef.current = nextSections;
        setCompletedElementIds(next);
        setSectionsCompleted(nextSections);
        return;
      }

      // Authenticated: optimistic update + persist to Firestore
      setCompletedElementIds((prev) => new Set([...prev, elementId]));
      pendingRef.current.add(elementId);

      updateCourseProgress({ courseId, elementId }).then((result) => {
        pendingRef.current.delete(elementId);

        if (!result.success) {
          // Rollback
          setCompletedElementIds((prev) => {
            const next = new Set(prev);
            next.delete(elementId);
            return next;
          });
          console.error("updateCourseProgress failed:", result.error);
          return;
        }

        // Re-fetch sections completed (section/course completion is computed server-side)
        getCourseProgress(courseId).then((refreshResult) => {
          if (refreshResult.success) {
            emitCompletionEvents(
              courseId,
              sectionsCompletedRef.current,
              refreshResult.entry.sectionsCompleted,
              sections,
            );
            sectionsCompletedRef.current =
              refreshResult.entry.sectionsCompleted;
            setSectionsCompleted(refreshResult.entry.sectionsCompleted);
          }
        });
      });
    },
    [courseId, completedElementIds, sections],
  );

  return (
    <CourseProgressContext.Provider
      value={{ completedElementIds, sectionsCompleted, markElementCompleted }}
    >
      {children}
    </CourseProgressContext.Provider>
  );
}

export function useCourseProgress(): CourseProgressContextValue {
  const ctx = useContext(CourseProgressContext);
  if (!ctx) {
    throw new Error(
      "useCourseProgress must be used within CourseProgressProvider",
    );
  }
  return ctx;
}

export function useCourseProgressOptional(): CourseProgressContextValue | null {
  return useContext(CourseProgressContext);
}
