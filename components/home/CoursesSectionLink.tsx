"use client";

import type { ComponentProps } from "react";

import {
  COURSES_SECTION_HREF,
  handleCoursesSectionLinkClick,
} from "@/lib/scroll-to-courses-section";

export function CoursesSectionLink({
  children,
  ...props
}: Omit<ComponentProps<"a">, "href" | "onClick">) {
  return (
    <a
      href={COURSES_SECTION_HREF}
      onClick={handleCoursesSectionLinkClick}
      {...props}
    >
      {children}
    </a>
  );
}
