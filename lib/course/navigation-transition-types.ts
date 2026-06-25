import type { CourseElement } from "@/schemas/courseSchema";

export type NavigationDirection = "forward" | "back" | "neutral";

export type TransitionOverlayVariant = "section" | "exercise";

export type CourseNavigationItem = {
  sectionId: string;
  elementId: string;
  path: string;
};

export type CourseSectionRef = {
  id: string;
  title: string;
  order: number;
};

export type CourseElementNavRef = {
  id: string;
  title: string;
  type: CourseElement["type"];
};

export type CourseNavigationMetadata = {
  items: CourseNavigationItem[];
  currentIndex: number;
  currentSection: CourseSectionRef;
  currentElement: CourseElementNavRef;
  nextElement: { id: string; title: string } | null;
  prevSection: CourseSectionRef | null;
  nextSection: CourseSectionRef | null;
  isNextSectionChange: boolean;
  isPrevSectionChange: boolean;
};

export type NavigationTransitionState = {
  direction: NavigationDirection;
  showTransitionOverlay: boolean;
  overlayVariant: TransitionOverlayVariant | null;
  overlayCompletedTitle: string;
  overlayNextTitle: string;
  boundaryKey: string;
};

export const DEFAULT_TRANSITION_STATE: NavigationTransitionState = {
  direction: "neutral",
  showTransitionOverlay: false,
  overlayVariant: null,
  overlayCompletedTitle: "",
  overlayNextTitle: "",
  boundaryKey: "",
};
