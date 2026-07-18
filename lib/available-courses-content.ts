import type { CourseDocument } from "@/schemas/courseSchema";
import { buildCourseLandingData } from "@/lib/course/landing-data";
import { getCoursePath } from "@/lib/courses";

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
  currentPrice?: number;
  regularPrice?: number;
};

const HTML_HIGHLIGHTS = [
  "Struktura strony",
  "Podstawowe tagi HTML",
  "Multimedia na stronie",
  "Formularze w HTML",
  "Semantyczne tagi HTML",
] as const;

const CSS_HIGHLIGHTS = [
  "Selektory i klasy CSS",
  "Kolory i typografia",
  "Box model",
  "Flexbox",
  "Responsywność",
] as const;

const STATIC_COURSES = [
  {
    id: "html-fundamentals",
    title: "Pełny kurs HTML",
    description:
      "Wszystko co musisz wiedzieć o HTML, aby zacząć tworzyć swoje pierwsze strony.",
    iconUrl: "/courses/html-fundamentals/html-logo.svg",
    highlights: HTML_HIGHLIGHTS,
    ctaType: "free-start" as const,
    primaryCtaLabel: "Rozpocznij za darmo",
  },
  {
    id: "css-basics",
    title: "Podstawy CSS",
    description:
      "Naucz się stylować strony HTML — od selektorów po responsywny layout.",
    iconUrl: "/courses/css-basics/css-logo.svg",
    highlights: CSS_HIGHLIGHTS,
    ctaType: "presale" as const,
    primaryCtaLabel: "Kup w przedsprzedaży",
    currentPrice: 39.99,
    regularPrice: 79.99,
  },
] as const;

export function buildAvailableCoursesDisplay(
  coursesById: Partial<Record<string, CourseDocument | null>>,
): AvailableCourseDisplay[] {
  return STATIC_COURSES.map((course) => {
    const courseDoc = coursesById[course.id] ?? null;
    const landing = courseDoc ? buildCourseLandingData(courseDoc) : null;
    const isFree = landing?.isFree ?? course.id === "html-fundamentals";
    const staticPrice =
      "currentPrice" in course ? course.currentPrice : undefined;
    const staticRegularPrice =
      "regularPrice" in course ? course.regularPrice : undefined;
    const isPresale = course.ctaType === "presale";

    return {
      id: course.id,
      title: landing?.title ?? course.title,
      description: landing?.description ?? course.description,
      iconUrl: landing?.imageUrl ?? course.iconUrl,
      highlights: [...course.highlights],
      ctaType: course.ctaType,
      primaryCtaLabel: course.primaryCtaLabel,
      detailsHref: getCoursePath(course.id),
      startHref: landing?.startHref ?? null,
      isFree,
      currentPrice: isFree
        ? undefined
        : (courseDoc?.price.currentPrice ?? staticPrice),
      regularPrice: isPresale
        ? (courseDoc?.price.standardPrice ?? staticRegularPrice)
        : undefined,
    };
  });
}
