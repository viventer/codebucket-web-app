import type { MouseEvent } from "react";

export const COURSES_SECTION_ID = "wybierz-kurs";
export const COURSES_SECTION_HREF = `/#${COURSES_SECTION_ID}`;

/** Matches `.snap-page { scroll-padding-top: 5rem }` and sticky header clearance. */
const SCROLL_TOP_OFFSET_PX = 80;

const SNAP_PAGE_CLASS = "snap-page";

type ScrollToCoursesSectionOptions = {
  behavior?: ScrollBehavior;
};

/**
 * Scrolls to the home courses section, accounting for the sticky header and
 * temporarily disabling scroll-snap so proximity snap cannot leave the
 * viewport mid-section.
 */
export function scrollToCoursesSection({
  behavior = "smooth",
}: ScrollToCoursesSectionOptions = {}) {
  const element = document.getElementById(COURSES_SECTION_ID);
  if (!element) return;

  const root = document.documentElement;
  const hadSnap = root.classList.contains(SNAP_PAGE_CLASS);
  if (hadSnap) {
    root.classList.remove(SNAP_PAGE_CLASS);
  }

  const top =
    element.getBoundingClientRect().top + window.scrollY - SCROLL_TOP_OFFSET_PX;

  window.scrollTo({ top: Math.max(0, top), behavior });

  if (window.location.hash !== `#${COURSES_SECTION_ID}`) {
    window.history.replaceState(null, "", COURSES_SECTION_HREF);
  }

  if (!hadSnap) return;

  if (behavior === "smooth") {
    window.setTimeout(() => {
      root.classList.add(SNAP_PAGE_CLASS);
    }, 500);
    return;
  }

  requestAnimationFrame(() => {
    root.classList.add(SNAP_PAGE_CLASS);
  });
}

/**
 * Same-page: scroll with header offset.
 * Other pages: full navigation to `/#wybierz-kurs` so the home page can land
 * on the section (Next.js client nav often ignores the hash).
 */
export function handleCoursesSectionLinkClick(
  event: MouseEvent<HTMLAnchorElement>,
) {
  event.preventDefault();

  if (window.location.pathname === "/") {
    scrollToCoursesSection();
    return;
  }

  window.location.assign(COURSES_SECTION_HREF);
}
