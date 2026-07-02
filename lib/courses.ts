import { promises as fs } from "fs";
import path from "path";
import type { Course, CourseElement } from "@/schemas/courseSchema";

export type CourseCardData = {
  id: string;
  title: string;
  description: string;
  badge: string;
  badgeClassName: string;
  currentPrice: number;
  whatYouWillLearn: string[];
  isPresale: boolean;
};

type CourseRegistryEntry = {
  folder: string;
  title: string;
  card?: Omit<CourseCardData, "id">;
};

const COURSE_REGISTRY: Record<string, CourseRegistryEntry> = {
  "html-fundamentals": {
    folder: "html fundamentals",
    title: "Pełny kurs HTML dla początkujących",
  },
  "css-basics": {
    folder: "css fundamentals",
    title: "Podstawy CSS",
    card: {
      title: "Podstawy CSS",
      description: "Naucz się stylować strony internetowe.",
      badge: "CSS",
      badgeClassName: "bg-sky-500 text-white",
      currentPrice: 59.99,
      isPresale: true,
      whatYouWillLearn: [
        "Selektory CSS i specyficzność",
        "Kolory i typografia",
        "CSS box-model",
        "Flexbox",
        "Responsywność",
        "CSS Grid",
      ],
    },
  },
};

export function getCourseTitle(id: string): string | undefined {
  return COURSE_REGISTRY[id]?.title;
}

export function getCoursePath(courseId: string): string {
  return `/course/${courseId}`;
}

export function getRegisteredCourseIds(): string[] {
  return Object.keys(COURSE_REGISTRY);
}

export function getCourseCardData(id: string): CourseCardData | null {
  const entry = COURSE_REGISTRY[id];
  if (!entry?.card) return null;

  return { id, ...entry.card };
}

export async function getAllCourseElementParams(): Promise<
  Array<{ id: string; section: string; element: string }>
> {
  const params: Array<{ id: string; section: string; element: string }> = [];

  for (const courseId of getRegisteredCourseIds()) {
    const course = await getCourseById(courseId);
    if (!course) continue;

    for (const section of course.sections) {
      for (const element of section.elements) {
        params.push({
          id: courseId,
          section: section.id,
          element: element.id,
        });
      }
    }
  }

  return params;
}

const ELEMENT_TYPE_LABELS: Record<CourseElement["type"], string> = {
  video: "Lekcja",
  platformCodeExercise: "Ćwiczenie",
  localCodeExercise: "Ćwiczenie",
  interactiveExercise: "Ćwiczenie",
  customExercise: "Ćwiczenie",
  interactiveDemo: "Demonstracja",
  guidedProject: "Projekt",
  individualProject: "Projekt indywidualny",
  cheatsheet: "Ściąga",
  courseEnding: "Zakończenie",
};

export function getElementTitle(element: CourseElement): string {
  if (element.type === "courseEnding") {
    return element.content.congrats.heading;
  }

  if ("title" in element.content && element.content.title) {
    return element.content.title;
  }
  return ELEMENT_TYPE_LABELS[element.type];
}

export function elementHasHint(element: CourseElement): boolean {
  if (
    element.type !== "platformCodeExercise" &&
    element.type !== "localCodeExercise" &&
    element.type !== "interactiveExercise" &&
    element.type !== "customExercise"
  ) {
    return false;
  }

  if (element.type === "platformCodeExercise") {
    return element.content.hints.length > 0;
  }

  return (element.content.hints?.length ?? 0) > 0;
}

export function elementHideInfoOnMobile(element: CourseElement): boolean {
  if (
    element.type !== "interactiveExercise" &&
    element.type !== "customExercise"
  ) {
    return false;
  }

  return true;
}

export function elementCentersMediaOnMobile(element: CourseElement): boolean {
  return (
    element.type === "video" ||
    element.type === "guidedProject" ||
    element.type === "cheatsheet"
  );
}

export function elementHasMaterials(element: CourseElement): boolean {
  if (
    element.type === "localCodeExercise" ||
    element.type === "guidedProject"
  ) {
    return element.content.hasMaterials;
  }

  if (element.type !== "individualProject") {
    return false;
  }

  const materials = element.content.materials;
  return (materials?.filter((item) => item.trim().length > 0).length ?? 0) > 0;
}

// Strict courseSchema.parse is intentionally skipped: the JSON stores
// createdAt/updatedAt as ISO strings while the schema expects Date instances.
// The layout only consumes structural fields (sections/elements/title).
export async function getCourseById(id: string): Promise<Course | null> {
  const entry = COURSE_REGISTRY[id];
  if (!entry) return null;

  const filePath = path.join(
    process.cwd(),
    "courses",
    entry.folder,
    "course.json",
  );

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Course;
  } catch {
    return null;
  }
}
