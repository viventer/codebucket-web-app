"use server";

import { adminDB } from "@/firebase/admin-init";
import { firestoreTimestampToDate } from "@/actions/courses/timestamps";
import type { CourseCardData, CourseNavigationData } from "@/actions/courses/types";
import type {
  CourseDocument,
  CourseElementDocument,
  CourseSectionDocument,
} from "@/schemas/courseSchema";
import {
  courseDocumentSchema,
  courseElementDocumentSchema,
  courseSectionDocumentSchema,
} from "@/schemas/courseSchema";

function coursesCollection() {
  return adminDB.collection("courses");
}

function courseDocRef(courseId: string) {
  return coursesCollection().doc(courseId);
}

function sectionsCollection(courseId: string) {
  return courseDocRef(courseId).collection("sections");
}

function elementsCollection(courseId: string, sectionId: string) {
  return sectionsCollection(courseId).doc(sectionId).collection("elements");
}

function parseCourseDocument(
  courseId: string,
  data: FirebaseFirestore.DocumentData,
): CourseDocument {
  return courseDocumentSchema.parse({
    ...data,
    id: data.id ?? courseId,
    createdAt: firestoreTimestampToDate(data.createdAt),
    updatedAt: firestoreTimestampToDate(data.updatedAt),
  });
}

function parseSectionDocument(
  sectionId: string,
  data: FirebaseFirestore.DocumentData,
): CourseSectionDocument {
  return courseSectionDocumentSchema.parse({
    ...data,
    id: data.id ?? sectionId,
  });
}

function parseElementDocument(
  elementId: string,
  data: FirebaseFirestore.DocumentData,
): CourseElementDocument {
  return courseElementDocumentSchema.parse({
    ...data,
    id: data.id ?? elementId,
  });
}

export async function listCourseIds(): Promise<string[]> {
  const snapshot = await coursesCollection().get();
  return snapshot.docs.map((doc) => doc.id);
}

export async function getCourseDocument(
  courseId: string,
): Promise<CourseDocument | null> {
  const snapshot = await courseDocRef(courseId).get();
  if (!snapshot.exists) {
    return null;
  }

  return parseCourseDocument(courseId, snapshot.data()!);
}

export async function getCourseSections(
  courseId: string,
): Promise<CourseSectionDocument[]> {
  const snapshot = await sectionsCollection(courseId)
    .orderBy("order")
    .get();

  return snapshot.docs.map((doc) =>
    parseSectionDocument(doc.id, doc.data()),
  );
}

export async function getSectionElementSummaries(
  courseId: string,
  sectionId: string,
): Promise<
  Array<Pick<CourseElementDocument, "id" | "type" | "order" | "displayTitle">>
> {
  const snapshot = await elementsCollection(courseId, sectionId)
    .orderBy("order")
    .select("id", "type", "order", "displayTitle")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: (data.id as string) ?? doc.id,
      type: data.type as CourseElementDocument["type"],
      order: data.order as number,
      displayTitle: data.displayTitle as string,
    };
  });
}

export async function getCourseElement(
  courseId: string,
  sectionId: string,
  elementId: string,
): Promise<CourseElementDocument | null> {
  const snapshot = await elementsCollection(courseId, sectionId)
    .doc(elementId)
    .get();

  if (!snapshot.exists) {
    return null;
  }

  return parseElementDocument(elementId, snapshot.data()!);
}

export async function getCourseNavigationData(
  courseId: string,
): Promise<CourseNavigationData | null> {
  const course = await getCourseDocument(courseId);
  if (!course) {
    return null;
  }

  return {
    course,
    outline: course.outline,
  };
}

export async function getAllCourseElementParams(): Promise<
  Array<{ id: string; section: string; element: string }>
> {
  const params: Array<{ id: string; section: string; element: string }> = [];
  const courseIds = await listCourseIds();

  for (const courseId of courseIds) {
    const course = await getCourseDocument(courseId);
    if (!course) continue;

    for (const section of course.outline.sections) {
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

export async function getCourseTitle(id: string): Promise<string | undefined> {
  const course = await getCourseDocument(id);
  return course?.title;
}

export async function getCourseCardData(
  id: string,
): Promise<CourseCardData | null> {
  const course = await getCourseDocument(id);
  if (!course?.isPresale || !course.badge || !course.badgeClassName) {
    return null;
  }

  const currentPrice = course.price.currentPrice;
  if (currentPrice === undefined) {
    return null;
  }

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    badge: course.badge,
    badgeClassName: course.badgeClassName,
    currentPrice,
    whatYouWillLearn: course.whatYouWillLearn,
    isPresale: course.isPresale,
  };
}
