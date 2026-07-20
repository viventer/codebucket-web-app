import { readFile } from "fs/promises";
import path from "path";

import { adminDB } from "@/firebase/admin-init";
import { getElementTitle } from "@/lib/courses";
import { dateToFirestoreTimestamp } from "@/actions/courses/timestamps";
import { COURSE_SEED_REGISTRY } from "@/actions/courses/seed-registry";
import type {
  Course,
  CourseDocument,
  CourseElement,
  CourseJson,
  CourseOutline,
} from "@/schemas/courseSchema";
import { courseJsonSchema } from "@/schemas/courseSchema";

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

function buildOutline(course: Course): CourseOutline {
  const sections = sortByOrder(course.sections).map((section) => ({
    id: section.id,
    title: section.title,
    description: section.description,
    order: section.order,
    elements: sortByOrder(section.elements).map((element) => ({
      id: element.id,
      type: element.type,
      displayTitle: getElementTitle(element),
      order: element.order,
    })),
  }));

  const firstSection = sections[0];
  const firstElement = firstSection?.elements[0];

  // Presale courses can have sections without any elements yet. Omit the start
  // pointers entirely (rather than writing `undefined`, which Firestore rejects).
  const outline: CourseOutline = { sections };
  if (firstSection && firstElement) {
    outline.startSectionId = firstSection.id;
    outline.startElementId = firstElement.id;
  }

  return outline;
}

function toCourseDocument(course: Course): CourseDocument {
  const { sections: _sections, ...metadata } = course;

  return {
    ...metadata,
    outline: buildOutline(course),
    isPresale: Boolean(course.presale),
  };
}

async function readCourseJson(folder: string): Promise<Course> {
  const filePath = path.join(process.cwd(), "courses", folder, "course.json");
  const raw = await readFile(filePath, "utf-8");
  const parsed = courseJsonSchema.parse(JSON.parse(raw) as CourseJson);

  return {
    ...parsed,
    createdAt:
      typeof parsed.createdAt === "string"
        ? new Date(parsed.createdAt)
        : parsed.createdAt,
    updatedAt:
      typeof parsed.updatedAt === "string"
        ? new Date(parsed.updatedAt)
        : parsed.updatedAt,
  };
}

async function seedCourseFromJson(courseId: string, folder: string) {
  const course = await readCourseJson(folder);
  const document = toCourseDocument(course);

  await courseDocRef(courseId).set({
    ...document,
    createdAt: dateToFirestoreTimestamp(document.createdAt),
    updatedAt: dateToFirestoreTimestamp(document.updatedAt),
  });

  for (const section of sortByOrder(course.sections)) {
    const { elements, ...sectionData } = section;

    await sectionsCollection(courseId)
      .doc(section.id)
      .set(sectionData);

    for (const element of sortByOrder(elements)) {
      await elementsCollection(courseId, section.id)
        .doc(element.id)
        .set(toElementDocument(element));
    }
  }

  console.log(
    `Seeded ${courseId}: ${course.sections.length} sections, ${course.sections.reduce((count, section) => count + section.elements.length, 0)} elements`,
  );
}

function toElementDocument(element: CourseElement) {
  return {
    ...element,
    displayTitle: getElementTitle(element),
  };
}

function courseDocRef(courseId: string) {
  return adminDB.collection("courses").doc(courseId);
}

function sectionsCollection(courseId: string) {
  return courseDocRef(courseId).collection("sections");
}

function elementsCollection(courseId: string, sectionId: string) {
  return sectionsCollection(courseId).doc(sectionId).collection("elements");
}

async function main() {
  for (const [courseId, entry] of Object.entries(COURSE_SEED_REGISTRY)) {
    await seedCourseFromJson(courseId, entry.folder);
  }

  console.log("Course seed completed.");
}

main().catch((error) => {
  console.error("Course seed failed:", error);
  process.exit(1);
});
