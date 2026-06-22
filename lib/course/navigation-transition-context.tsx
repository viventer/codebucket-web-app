"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";

import {
  DEFAULT_TRANSITION_STATE,
  type CourseNavigationMetadata,
  type NavigationDirection,
  type NavigationTransitionState,
} from "./navigation-transition-types";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

const NAVIGATION_INTENT_STORAGE_KEY = "course-navigation-intent";

type CourseNavigationContextValue = {
  metadata: CourseNavigationMetadata;
  transitionState: NavigationTransitionState;
  setNavigationIntent: (direction: NavigationDirection) => void;
};

const CourseNavigationContext =
  createContext<CourseNavigationContextValue | null>(null);

type CourseNavigationProviderProps = {
  metadata: CourseNavigationMetadata;
  children: ReactNode;
};

let lastKnownPathname: string | null = null;

function resolveDirection(
  intent: NavigationDirection,
  previousIndex: number,
  currentIndex: number,
): NavigationDirection {
  if (intent !== "neutral") {
    return intent;
  }

  if (previousIndex < 0 || currentIndex < 0) {
    return "neutral";
  }

  const indexDelta = currentIndex - previousIndex;

  if (indexDelta === 1) {
    return "forward";
  }

  if (indexDelta === -1) {
    return "back";
  }

  return "neutral";
}

function readStoredIntent(): NavigationDirection | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.sessionStorage.getItem(NAVIGATION_INTENT_STORAGE_KEY);

  if (
    stored === "forward" ||
    stored === "back" ||
    stored === "neutral"
  ) {
    return stored;
  }

  return null;
}

function clearStoredIntent() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(NAVIGATION_INTENT_STORAGE_KEY);
}

function computeTransitionState(
  previousPathname: string,
  pathname: string,
  metadata: CourseNavigationMetadata,
  intent: NavigationDirection,
  prefersReducedMotion: boolean,
): NavigationTransitionState {
  const previousIndex = metadata.items.findIndex(
    (item) => item.path === previousPathname,
  );
  const direction = resolveDirection(
    intent,
    previousIndex,
    metadata.currentIndex,
  );

  const previousItem =
    previousIndex >= 0 ? metadata.items[previousIndex] : undefined;
  const currentItem = metadata.items[metadata.currentIndex];
  const isSectionBoundary = Boolean(
    previousItem &&
      currentItem &&
      previousItem.sectionId !== currentItem.sectionId,
  );

  return {
    direction,
    isSectionBoundary,
    showSectionOverlay:
      !prefersReducedMotion && direction === "forward" && isSectionBoundary,
    sectionOverlayTitle: metadata.currentSection.title,
    sectionOverlayOrder: metadata.currentSection.order,
    boundaryKey: pathname,
  };
}

export function CourseNavigationProvider({
  metadata,
  children,
}: CourseNavigationProviderProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  let transitionState = DEFAULT_TRANSITION_STATE;

  if (lastKnownPathname !== null && pathname !== lastKnownPathname) {
    const storedIntent = readStoredIntent();
    const intent = storedIntent ?? "neutral";

    transitionState = computeTransitionState(
      lastKnownPathname,
      pathname,
      metadata,
      intent,
      prefersReducedMotion,
    );

    clearStoredIntent();
  }

  lastKnownPathname = pathname;

  const setNavigationIntent = useCallback((direction: NavigationDirection) => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(NAVIGATION_INTENT_STORAGE_KEY, direction);
    }
  }, []);

  const value: CourseNavigationContextValue = {
    metadata,
    transitionState,
    setNavigationIntent,
  };

  return (
    <CourseNavigationContext.Provider value={value}>
      {children}
    </CourseNavigationContext.Provider>
  );
}

export function useCourseNavigation(): CourseNavigationContextValue {
  const context = useContext(CourseNavigationContext);

  if (!context) {
    throw new Error(
      "useCourseNavigation must be used within CourseNavigationProvider",
    );
  }

  return context;
}

export function useCourseNavigationOptional():
  | CourseNavigationContextValue
  | null {
  return useContext(CourseNavigationContext);
}

export function resetNavigationTransitionStateForTests() {
  lastKnownPathname = null;
}
