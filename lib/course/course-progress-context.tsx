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

  useEffect(() => {
    if (isGuestUser()) {
      const ids = new Set(readGuestProgress(courseId));
      setCompletedElementIds(ids);
      setSectionsCompleted(computeSectionsCompleted(sections, ids));
    } else {
      getCourseProgress(courseId).then((result) => {
        if (result.success) {
          setCompletedElementIds(new Set(result.entry.elementsCompleted));
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
        setCompletedElementIds((prev) => {
          const next = new Set([...prev, elementId]);
          setSectionsCompleted(computeSectionsCompleted(sections, next));
          return next;
        });
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
