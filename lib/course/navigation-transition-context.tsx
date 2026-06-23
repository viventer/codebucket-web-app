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
  type NavigationIntentOptions,
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
  transitionState: NavigationTransitionState;
  setNavigationIntent: (
    direction: NavigationDirection,
    options?: NavigationIntentOptions,
  ) => void;
};

const CourseNavigationContext =
  createContext<CourseNavigationContextValue | null>(null);

type CourseNavigationProviderProps = {
  metadata: CourseNavigationMetadata;
  children: ReactNode;
};

let lastKnownPathname: string | null = null;
let lastKnownSectionId: string | null = null;
let lastKnownSectionTitle: string | null = null;
let lastKnownSectionOrder: number | null = null;
let pendingSectionSnapshot: PendingSectionSnapshot | null = null;
let activeTransitionState: NavigationTransitionState = DEFAULT_TRANSITION_STATE;

function resolveDirection(
  intent: NavigationDirection,
  previousIndex: number,
  currentIndex: number,
  isSectionBoundary: boolean,
): NavigationDirection {
  if (intent !== "neutral") {
    return intent;
  }

  if (previousIndex >= 0 && currentIndex >= 0) {
    const indexDelta = currentIndex - previousIndex;

    if (indexDelta === 1) {
      return "forward";
    }

    if (indexDelta === -1) {
      return "back";
    }
  }

  if (isSectionBoundary) {
    return "forward";
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
  previousSectionId: string | null,
  previousSectionTitle: string | null,
  previousSectionOrder: number | null,
  pathname: string,
  metadata: CourseNavigationMetadata,
  intent: NavigationDirection,
): NavigationTransitionState {
  const previousIndex = metadata.items.findIndex(
    (item) => item.path === previousPathname,
  );

  const isSectionBoundary = Boolean(
    previousSectionId && previousSectionId !== metadata.currentSection.id,
  );

  const direction = resolveDirection(
    intent,
    previousIndex,
    metadata.currentIndex,
    isSectionBoundary,
  );

  return {
    direction,
    isSectionBoundary,
    showSectionOverlay: direction === "forward" && isSectionBoundary,
    completedSectionTitle: previousSectionTitle ?? "",
    completedSectionOrder: previousSectionOrder ?? 0,
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
        lastKnownSectionId,
        lastKnownSectionTitle,
        lastKnownSectionOrder,
        pathname,
        metadata,
        storedIntent,
      );
    }

    pendingSectionSnapshot = null;
    clearStoredNavigationFlags();
  }

  lastKnownPathname = pathname;
  lastKnownSectionId = metadata.currentSection.id;
  lastKnownSectionTitle = metadata.currentSection.title;
  lastKnownSectionOrder = metadata.currentSection.order;

  const setNavigationIntent = useCallback(
    (direction: NavigationDirection, options?: NavigationIntentOptions) => {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(NAVIGATION_INTENT_STORAGE_KEY, direction);
      }

      if (!options?.crossesSection) {
        return;
      }

      const currentMetadata = metadataRef.current;
      const snapshot: PendingSectionSnapshot = {
        completedSectionTitle: currentMetadata.currentSection.title,
        completedSectionOrder: currentMetadata.currentSection.order,
        sectionOverlayTitle: currentMetadata.nextSection?.title ?? "",
        sectionOverlayOrder: currentMetadata.nextSection?.order ?? 0,
      };

      pendingSectionSnapshot = snapshot;

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          PENDING_SECTION_SNAPSHOT_KEY,
          JSON.stringify(snapshot),
        );
      }
    },
    [],
  );

  const value: CourseNavigationContextValue = {
    metadata,
    transitionState: activeTransitionState,
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
  lastKnownSectionId = null;
  lastKnownSectionTitle = null;
  lastKnownSectionOrder = null;
  pendingSectionSnapshot = null;
  activeTransitionState = DEFAULT_TRANSITION_STATE;
}
