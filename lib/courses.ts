import { promises as fs } from "fs";
import path from "path";
import type { Course, CourseElement } from "@/schemas/courseSchema";

type CourseRegistryEntry = {
  folder: string;
  title: string;
};

const COURSE_REGISTRY: Record<string, CourseRegistryEntry> = {
  "html-fundamentals": {
    folder: "html fundamentals",
    title: "Pełny kurs HTML dla początkujących",
  },
  "css-basics": {
    folder: "css fundamentals",
    title: "Podstawy CSS",
  },
};

export function getCourseTitle(id: string): string | undefined {
  return COURSE_REGISTRY[id]?.title;
}

const ELEMENT_TYPE_LABELS: Record<CourseElement["type"], string> = {
  video: "Lekcja",
  codeExercise: "Ćwiczenie",
  interactiveExercise: "Ćwiczenie",
  interactiveDemo: "Demonstracja",
  quiz: "Quiz",
  guidedProject: "Projekt",
  individualProject: "Projekt indywidualny",
};

export function getElementTitle(element: CourseElement): string {
  if ("title" in element.content && element.content.title) {
    return element.content.title;
  }
  return ELEMENT_TYPE_LABELS[element.type];
}

export function elementHasHint(element: CourseElement): boolean {
  if (element.type !== "codeExercise" && element.type !== "interactiveExercise") {
    return false;
  }

  if (element.type === "codeExercise") {
    return element.content.hints.length > 0;
  }

  return (element.content.hints?.length ?? 0) > 0;
}

export function elementHideInfoOnMobile(element: CourseElement): boolean {
  if (element.type !== "interactiveExercise") {
    return false;
  }

  return true;
}

export function elementHasMaterials(element: CourseElement): boolean {
  if (
    element.type !== "guidedProject" &&
    element.type !== "individualProject"
  ) {
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
