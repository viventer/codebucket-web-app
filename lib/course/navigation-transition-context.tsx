"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useRef, type ReactNode } from "react";

import {
  DEFAULT_TRANSITION_STATE,
  type CourseNavigationMetadata,
  type NavigationDirection,
  type NavigationTransitionState,
  type TransitionOverlayVariant,
} from "./navigation-transition-types";

const NAVIGATION_INTENT_STORAGE_KEY = "course-navigation-intent";
const PENDING_OVERLAY_SNAPSHOT_KEY = "course-navigation-overlay-snapshot";

type PendingOverlaySnapshot = {
  variant: TransitionOverlayVariant;
  completedTitle: string;
  nextTitle: string;
};

type CourseNavigationContextValue = {
  metadata: CourseNavigationMetadata;
  sectionsCompleted: string[];
  elementsCompleted: string[];
  transitionState: NavigationTransitionState;
  setNavigationIntent: (direction: NavigationDirection) => void;
  beginSectionTransition: () => void;
  beginExerciseTransition: () => void;
};

const CourseNavigationContext =
  createContext<CourseNavigationContextValue | null>(null);

type CourseNavigationProviderProps = {
  metadata: CourseNavigationMetadata;
  sectionsCompleted: string[];
  elementsCompleted: string[];
  children: ReactNode;
};

let lastKnownPathname: string | null = null;
let pendingOverlaySnapshot: PendingOverlaySnapshot | null = null;
let activeTransitionState: NavigationTransitionState = DEFAULT_TRANSITION_STATE;

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

  if (stored === "forward" || stored === "back" || stored === "neutral") {
    return stored;
  }

  return null;
}

function readStoredOverlaySnapshot(): PendingOverlaySnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.sessionStorage.getItem(PENDING_OVERLAY_SNAPSHOT_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as PendingOverlaySnapshot;
  } catch {
    return null;
  }
}

function clearStoredNavigationFlags() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(NAVIGATION_INTENT_STORAGE_KEY);
  window.sessionStorage.removeItem(PENDING_OVERLAY_SNAPSHOT_KEY);
}

function buildOverlayTransitionState(
  pathname: string,
  snapshot: PendingOverlaySnapshot,
): NavigationTransitionState {
  return {
    direction: "forward",
    showTransitionOverlay: true,
    overlayVariant: snapshot.variant,
    overlayCompletedTitle: snapshot.completedTitle,
    overlayNextTitle: snapshot.nextTitle,
    boundaryKey: pathname,
  };
}

function computeTransitionState(
  previousPathname: string,
  pathname: string,
  metadata: CourseNavigationMetadata,
  intent: NavigationDirection,
): NavigationTransitionState {
  const previousIndex = metadata.items.findIndex(
    (item) => item.path === previousPathname,
  );

  const direction = resolveDirection(
    intent,
    previousIndex,
    metadata.currentIndex,
  );

  return {
    direction,
    showTransitionOverlay: false,
    overlayVariant: null,
    overlayCompletedTitle: "",
    overlayNextTitle: "",
    boundaryKey: pathname,
  };
}

function storeOverlaySnapshot(snapshot: PendingOverlaySnapshot) {
  pendingOverlaySnapshot = snapshot;

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(
      PENDING_OVERLAY_SNAPSHOT_KEY,
      JSON.stringify(snapshot),
    );
  }
}

export function CourseNavigationProvider({
  metadata,
  sectionsCompleted,
  elementsCompleted,
  children,
}: CourseNavigationProviderProps) {
  const pathname = usePathname();
  const metadataRef = useRef(metadata);
  metadataRef.current = metadata;

  if (lastKnownPathname !== null && pathname !== lastKnownPathname) {
    const storedIntent = readStoredIntent() ?? "neutral";
    const storedSnapshot =
      pendingOverlaySnapshot ?? readStoredOverlaySnapshot();

    if (storedSnapshot) {
      activeTransitionState = buildOverlayTransitionState(
        pathname,
        storedSnapshot,
      );
    } else {
      activeTransitionState = computeTransitionState(
        lastKnownPathname,
        pathname,
        metadata,
        storedIntent,
      );
    }

    pendingOverlaySnapshot = null;
    clearStoredNavigationFlags();
  }

  lastKnownPathname = pathname;

  function setNavigationIntent(direction: NavigationDirection) {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(NAVIGATION_INTENT_STORAGE_KEY, direction);
    }
  }

  function beginSectionTransition() {
    const currentMetadata = metadataRef.current;

    storeOverlaySnapshot({
      variant: "section",
      completedTitle: currentMetadata.currentSection.title,
      nextTitle: currentMetadata.nextSection?.title ?? "",
    });
  }

  function beginExerciseTransition() {
    const currentMetadata = metadataRef.current;

    storeOverlaySnapshot({
      variant: "exercise",
      completedTitle: currentMetadata.currentElement.title,
      nextTitle: currentMetadata.nextElement?.title ?? "",
    });
  }

  const value: CourseNavigationContextValue = {
    metadata,
    sectionsCompleted,
    elementsCompleted,
    transitionState: activeTransitionState,
    setNavigationIntent,
    beginSectionTransition,
    beginExerciseTransition,
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

export function useCourseNavigationOptional(): CourseNavigationContextValue | null {
  return useContext(CourseNavigationContext);
}

export function resetNavigationTransitionStateForTests() {
  lastKnownPathname = null;
  pendingOverlaySnapshot = null;
  activeTransitionState = DEFAULT_TRANSITION_STATE;
}
