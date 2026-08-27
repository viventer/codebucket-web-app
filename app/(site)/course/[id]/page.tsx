import { notFound } from "next/navigation";

import { ViewItemTracker } from "@/components/analytics/ViewItemTracker";
import { CourseLandingPage } from "@/components/course/landing/CourseLandingPage";
import {
  buildCourseLandingData,
  getPrerequisiteCourseIds,
} from "@/lib/course/landing-data";
import {
  getCourseDocument,
  listCourseIds,
} from "@/actions/courses/read-courses";

export async function generateStaticParams() {
  const courseIds = await listCourseIds();
  return courseIds.map((id) => ({ id }));
}

type CourseLandingRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function CourseLandingRoute({
  params,
}: CourseLandingRouteProps) {
  const { id } = await params;

  const course = await getCourseDocument(id);
  if (!course) notFound();

  const prerequisiteCourseIds = getPrerequisiteCourseIds(course);
  const existingPrerequisiteCourseIds = new Set(
    (
      await Promise.all(
        prerequisiteCourseIds.map(async (courseId) => {
          const prerequisiteCourse = await getCourseDocument(courseId);
          return prerequisiteCourse ? courseId : null;
        }),
      )
    ).filter((courseId): courseId is string => courseId !== null),
  );

  const data = buildCourseLandingData(course, existingPrerequisiteCourseIds);

  return (
    <>
      <ViewItemTracker
        itemId={data.id}
        itemName={data.title}
        value={data.currentPrice}
        currency={data.currentPrice !== undefined ? "PLN" : undefined}
      />
      <CourseLandingPage data={data} />
    </>
  );
}
