"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";

import {
  DEFAULT_TRANSITION_STATE,
  type CourseNavigationMetadata,
  type NavigationDirection,
  type NavigationTransitionState,
} from "./navigation-transition-types";

const NAVIGATION_INTENT_STORAGE_KEY = "course-navigation-intent";
const PENDING_SECTION_SNAPSHOT_KEY = "course-navigation-section-snapshot";

type PendingSectionSnapshot = {
  completedSectionTitle: string;
  completedSectionOrder: number;
  sectionOverlayTitle: string;
  sectionOverlayOrder: number;
};

type CourseNavigationContextValue = {
  metadata: CourseNavigationMetadata;
  sectionsCompleted: string[];
  transitionState: NavigationTransitionState;
  setNavigationIntent: (direction: NavigationDirection) => void;
  beginSectionTransition: () => void;
};

const CourseNavigationContext =
  createContext<CourseNavigationContextValue | null>(null);

type CourseNavigationProviderProps = {
  metadata: CourseNavigationMetadata;
  sectionsCompleted: string[];
  children: ReactNode;
};

let lastKnownPathname: string | null = null;
let pendingSectionSnapshot: PendingSectionSnapshot | null = null;
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

  if (
    stored === "forward" ||
    stored === "back" ||
    stored === "neutral"
  ) {
    return stored;
  }

  return null;
}

function readStoredSectionSnapshot(): PendingSectionSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.sessionStorage.getItem(PENDING_SECTION_SNAPSHOT_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as PendingSectionSnapshot;
  } catch {
    return null;
  }
}

function clearStoredNavigationFlags() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(NAVIGATION_INTENT_STORAGE_KEY);
  window.sessionStorage.removeItem(PENDING_SECTION_SNAPSHOT_KEY);
}

function buildSectionTransitionState(
  pathname: string,
  snapshot: PendingSectionSnapshot,
): NavigationTransitionState {
  return {
    direction: "forward",
    isSectionBoundary: true,
    showSectionOverlay: true,
    completedSectionTitle: snapshot.completedSectionTitle,
    completedSectionOrder: snapshot.completedSectionOrder,
    sectionOverlayTitle: snapshot.sectionOverlayTitle,
    sectionOverlayOrder: snapshot.sectionOverlayOrder,
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
    isSectionBoundary: false,
    showSectionOverlay: false,
    completedSectionTitle: "",
    completedSectionOrder: 0,
    sectionOverlayTitle: "",
    sectionOverlayOrder: 0,
    boundaryKey: pathname,
  };
}

function storeSectionSnapshot(snapshot: PendingSectionSnapshot) {
  pendingSectionSnapshot = snapshot;

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(
      PENDING_SECTION_SNAPSHOT_KEY,
      JSON.stringify(snapshot),
    );
  }
}

export function CourseNavigationProvider({
  metadata,
  sectionsCompleted,
  children,
}: CourseNavigationProviderProps) {
  const pathname = usePathname();
  const metadataRef = useRef(metadata);
  metadataRef.current = metadata;

  if (lastKnownPathname !== null && pathname !== lastKnownPathname) {
    const storedIntent = readStoredIntent() ?? "neutral";
    const storedSnapshot = pendingSectionSnapshot ?? readStoredSectionSnapshot();

    if (storedSnapshot) {
      activeTransitionState = buildSectionTransitionState(
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

    pendingSectionSnapshot = null;
    clearStoredNavigationFlags();
  }

  lastKnownPathname = pathname;

  const setNavigationIntent = useCallback((direction: NavigationDirection) => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(NAVIGATION_INTENT_STORAGE_KEY, direction);
    }
  }, []);

  const beginSectionTransition = useCallback(() => {
    const currentMetadata = metadataRef.current;

    storeSectionSnapshot({
      completedSectionTitle: currentMetadata.currentSection.title,
      completedSectionOrder: currentMetadata.currentSection.order,
      sectionOverlayTitle: currentMetadata.nextSection?.title ?? "",
      sectionOverlayOrder: currentMetadata.nextSection?.order ?? 0,
    });
  }, []);

  const value: CourseNavigationContextValue = {
    metadata,
    sectionsCompleted,
    transitionState: activeTransitionState,
    setNavigationIntent,
    beginSectionTransition,
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
  pendingSectionSnapshot = null;
  activeTransitionState = DEFAULT_TRANSITION_STATE;
}
