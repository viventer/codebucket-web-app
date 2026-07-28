import type { CourseDocument } from "@/schemas/courseSchema";
import {
  buildCourseLandingSectionInputs,
  getCourseImageUrl,
  getFirstElementPath,
} from "@/lib/course/landing-data";
import { getCoursePath } from "@/lib/courses";
import type { CourseLandingSectionInput } from "@/lib/course/landing-user-state";

export type AvailableCourseCtaType = "free-start" | "presale";

export type AvailableCourseDisplay = {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  highlights: string[];
  ctaType: AvailableCourseCtaType;
  primaryCtaLabel: string;
  detailsHref: string;
  startHref: string | null;
  isFree: boolean;
  isPresale: boolean;
  sections: CourseLandingSectionInput[];
  currentPrice?: number;
  regularPrice?: number;
  refundDays?: number;
};

/**
 * Derives the "Wybierz swój kurs" home section entirely from seeded course
 * documents, so course.json (via Firestore) stays the single source of truth.
 */
export function buildAvailableCoursesDisplay(
  courses: CourseDocument[],
): AvailableCourseDisplay[] {
  return courses.map((course) => {
    const isFree = course.price.isFree;
    const isPresale = course.isPresale ?? Boolean(course.presale);
    const ctaType: AvailableCourseCtaType = isFree ? "free-start" : "presale";

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      iconUrl: getCourseImageUrl(course.id, course.image),
      highlights: course.highlights ?? [],
      ctaType,
      primaryCtaLabel: isFree ? "Rozpocznij za darmo" : "Kup w przedsprzedaży",
      detailsHref: getCoursePath(course.id),
      startHref: getFirstElementPath(course),
      isFree,
      isPresale,
      sections: buildCourseLandingSectionInputs(course),
      currentPrice: isFree ? undefined : course.price.currentPrice,
      regularPrice: isPresale ? course.price.standardPrice : undefined,
      refundDays: course.presale?.refundDays,
    };
  });
}
