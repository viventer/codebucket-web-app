import { notFound } from "next/navigation";

import { CourseLandingPage } from "@/components/course/landing/CourseLandingPage";
import { buildCourseLandingData } from "@/lib/course/landing-data";
import { getCourseDocument, listCourseIds } from "@/actions/courses/read-courses";

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

  const data = buildCourseLandingData(course);

  return <CourseLandingPage data={data} />;
}
