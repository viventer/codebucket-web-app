import { getElementTitle } from "@/lib/courses";
import type { Course } from "@/schemas/courseSchema";
import type { CourseElement } from "@/schemas/courseSchema";

export type CourseLandingSection = {
  id: string;
  title: string;
  description: string;
  order: number;
  elements: Array<{
    id: string;
    title: string;
    type: CourseElement["type"];
    href: string;
  }>;
};

export type CourseLandingData = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isFree: boolean;
  startHref: string;
  courseIncludes: string[];
  durationLabel: string;
  levelLabel: string;
  prerequisitesLabel: string;
  whatYouWillLearn: string[];
  ctaDescription: string;
  startButtonLabel: string;
  finalCtaButtonLabel: string;
  sections: CourseLandingSection[];
};

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return minutes === 1 ? "1 minuta" : `${minutes} minut`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const hourLabel =
    hours === 1
      ? "1 godzina"
      : hours < 5
        ? `${hours} godziny`
        : `${hours} godzin`;

  if (remainingMinutes === 0) {
    return hourLabel;
  }

  const minuteLabel =
    remainingMinutes === 1
      ? "1 minuta"
      : remainingMinutes < 5
        ? `${remainingMinutes} minuty`
        : `${remainingMinutes} minut`;

  return `${hourLabel} ${minuteLabel}`;
}

function formatPrerequisites(prerequisites: string[] | undefined): string {
  if (!prerequisites || prerequisites.length === 0) {
    return "Brak";
  }

  return prerequisites.join(", ");
}

export function getCourseImageUrl(courseId: string, filename: string): string {
  const normalizedFilename = filename.replace(/^\/+/, "");
  return `/courses/${courseId}/${normalizedFilename}`;
}

export function getFirstElementPath(course: Course): string {
  const firstSection = [...course.sections].sort(
    (a, b) => a.order - b.order,
  )[0];
  const firstElement = [...firstSection.elements].sort(
    (a, b) => a.order - b.order,
  )[0];

  return `/course/${course.id}/${firstSection.id}/${firstElement.id}`;
}

export function buildCourseLandingData(course: Course): CourseLandingData {
  const startHref = getFirstElementPath(course);
  const isFree = course.price.isFree;

  const sections = [...course.sections]
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      order: section.order,
      elements: [...section.elements]
        .sort((a, b) => a.order - b.order)
        .map((element) => ({
          id: element.id,
          title: getElementTitle(element),
          type: element.type,
          href: `/course/${course.id}/${section.id}/${element.id}`,
        })),
    }));

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    imageUrl: getCourseImageUrl(course.id, course.image),
    isFree,
    startHref,
    courseIncludes: course.courseIncludes,
    durationLabel: formatDuration(course.duration),
    levelLabel: course.level ?? "—",
    prerequisitesLabel: formatPrerequisites(course.prerequisites),
    whatYouWillLearn: course.whatYouWillLearn,
    ctaDescription: course.CTADescription,
    startButtonLabel: isFree ? "Rozpocznij za darmo" : "Rozpocznij kurs",
    finalCtaButtonLabel: isFree
      ? "Rozpocznij naukę za darmo"
      : "Rozpocznij naukę",
    sections,
  };
}
