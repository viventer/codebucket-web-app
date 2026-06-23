export type NavigationDirection = "forward" | "back" | "neutral";

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

export type CourseNavigationMetadata = {
  items: CourseNavigationItem[];
  currentIndex: number;
  currentSection: CourseSectionRef;
  prevSection: CourseSectionRef | null;
  nextSection: CourseSectionRef | null;
  isNextSectionChange: boolean;
  isPrevSectionChange: boolean;
};

export type NavigationTransitionState = {
  direction: NavigationDirection;
  isSectionBoundary: boolean;
  showSectionOverlay: boolean;
  completedSectionTitle: string;
  completedSectionOrder: number;
  sectionOverlayTitle: string;
  sectionOverlayOrder: number;
  boundaryKey: string;
};

export const DEFAULT_TRANSITION_STATE: NavigationTransitionState = {
  direction: "neutral",
  isSectionBoundary: false,
  showSectionOverlay: false,
  completedSectionTitle: "",
  completedSectionOrder: 0,
  sectionOverlayTitle: "",
  sectionOverlayOrder: 0,
  boundaryKey: "",
};
