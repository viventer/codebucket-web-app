import type { CourseDocument, CourseElement } from "@/schemas/courseSchema";
import {
  sortOutlineElements,
  sortOutlineSections,
} from "@/actions/courses/helpers";
import { getCoursePath } from "@/lib/courses";

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

export type CoursePresaleInfo = {
  /** e.g. "25.07.2026" */
  presaleStartDateLabel: string;
  /** e.g. "08.08.2026" */
  releaseDateLabel: string;
  /** e.g. "8 sierpnia" */
  releaseDateLongLabel: string;
  refundDays: number;
};

export type CourseLandingMethod = {
  title: string;
  description: string;
  icon: string;
};

export type CourseLandingFaqItem = {
  question: string;
  answer: string;
};

export type CourseLandingPrerequisite = {
  label: string;
  courseHref: string | null;
};

export type CourseLandingData = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isFree: boolean;
  isPresale: boolean;
  currentPrice?: number;
  standardPrice?: number;
  presale: CoursePresaleInfo | null;
  startHref: string | null;
  courseIncludes: string[];
  durationLabel: string;
  levelLabel: string;
  prerequisites: CourseLandingPrerequisite[];
  whatYouWillLearn: string[];
  additionalLearningMethods: CourseLandingMethod[];
  faq: CourseLandingFaqItem[];
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

function normalizePrerequisite(
  prerequisite: NonNullable<CourseDocument["prerequisites"]>[number],
): { label: string; courseId?: string } {
  if (typeof prerequisite === "string") {
    return { label: prerequisite };
  }

  return prerequisite;
}

export function getPrerequisiteCourseIds(
  course: Pick<CourseDocument, "prerequisites">,
): string[] {
  if (!course.prerequisites?.length) {
    return [];
  }

  const ids = course.prerequisites
    .map((prerequisite) => normalizePrerequisite(prerequisite).courseId)
    .filter((courseId): courseId is string => courseId !== undefined);

  return [...new Set(ids)];
}

function buildPrerequisites(
  prerequisites: CourseDocument["prerequisites"],
  existingPrerequisiteCourseIds: ReadonlySet<string>,
): CourseLandingPrerequisite[] {
  if (!prerequisites?.length) {
    return [];
  }

  return prerequisites.map((prerequisite) => {
    const { label, courseId } = normalizePrerequisite(prerequisite);

    return {
      label,
      courseHref:
        courseId && existingPrerequisiteCourseIds.has(courseId)
          ? getCoursePath(courseId)
          : null,
    };
  });
}

export function getCourseImageUrl(courseId: string, filename: string): string {
  const normalizedFilename = filename.replace(/^\/+/, "");
  return `/courses/${courseId}/${normalizedFilename}`;
}

// Dates are stored as date-only ISO strings (e.g. "2026-08-08") and parsed as
// UTC midnight, so format in UTC to avoid off-by-one shifts across time zones.
const shortDateFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const longDateFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

function buildPresaleInfo(
  presale: CourseDocument["presale"],
): CoursePresaleInfo | null {
  if (!presale) {
    return null;
  }

  const presaleStart = new Date(presale.presaleStartDate);
  const releaseDate = new Date(presale.releaseDate);

  return {
    presaleStartDateLabel: shortDateFormatter.format(presaleStart),
    releaseDateLabel: shortDateFormatter.format(releaseDate),
    releaseDateLongLabel: longDateFormatter.format(releaseDate),
    refundDays: presale.refundDays,
  };
}

export function getPresaleRiskFreeBenefit(refundDays: number): {
  title: string;
  description: string;
} {
  return {
    title: "Kupujesz bez ryzyka",
    description: `Możesz zrezygnować z zakupu do ${refundDays} dni od premiery kursu i otrzymać pełny zwrot środków.`,
  };
}

export function getFirstElementPath(course: CourseDocument): string | null {
  const { startSectionId, startElementId } = course.outline;
  if (!startSectionId || !startElementId) {
    return null;
  }

  return `/course/${course.id}/${startSectionId}/${startElementId}`;
}

export function buildCourseLandingData(
  course: CourseDocument,
  existingPrerequisiteCourseIds: ReadonlySet<string> = new Set(),
): CourseLandingData {
  const startHref = getFirstElementPath(course);
  const isFree = course.price.isFree;
  const isPresale = course.isPresale ?? Boolean(course.presale);

  const sections = sortOutlineSections(course.outline).map((section) => ({
    id: section.id,
    title: section.title,
    description: section.description,
    order: section.order,
    elements: sortOutlineElements(section.elements).map((element) => ({
      id: element.id,
      title: element.displayTitle,
      type: element.type,
      href: `/course/${course.id}/${section.id}/${element.id}`,
    })),
  }));

  const ctaLabel = isPresale
    ? "Kup w przedsprzedaży"
    : isFree
      ? "Rozpocznij za darmo"
      : "Rozpocznij kurs";

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    imageUrl: getCourseImageUrl(course.id, course.image),
    isFree,
    isPresale,
    currentPrice: course.price.currentPrice,
    standardPrice: course.price.standardPrice,
    presale: buildPresaleInfo(course.presale),
    startHref,
    courseIncludes: course.courseIncludes,
    durationLabel: formatDuration(course.duration),
    levelLabel: course.level ?? "—",
    prerequisites: buildPrerequisites(
      course.prerequisites,
      existingPrerequisiteCourseIds,
    ),
    whatYouWillLearn: course.whatYouWillLearn,
    additionalLearningMethods: course.additionalLearningMethods ?? [],
    faq: course.faq ?? [],
    ctaDescription: course.CTADescription,
    startButtonLabel: ctaLabel,
    finalCtaButtonLabel: ctaLabel,
    sections,
  };
}
