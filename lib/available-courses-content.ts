import type { CourseLandingData } from "@/lib/course/landing-data";
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
  },
] as const;

export function buildAvailableCoursesDisplay(
  htmlLanding: CourseLandingData | null,
): AvailableCourseDisplay[] {
  return STATIC_COURSES.map((course) => {
    const isHtmlCourse = course.id === "html-fundamentals";
    const landing = isHtmlCourse ? htmlLanding : null;

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
      isFree: landing?.isFree ?? isHtmlCourse,
    };
  });
}
