import { notFound } from "next/navigation";

import { CourseLandingPage } from "@/components/course/landing/CourseLandingPage";
import { buildCourseLandingData } from "@/lib/course/landing-data";
import { getCourseById, getRegisteredCourseIds } from "@/lib/courses";

export async function generateStaticParams() {
  return getRegisteredCourseIds().map((id) => ({ id }));
}

type CourseLandingRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function CourseLandingRoute({
  params,
}: CourseLandingRouteProps) {
  const { id } = await params;

  const course = await getCourseById(id);
  if (!course) notFound();

  const data = buildCourseLandingData(course);

  return <CourseLandingPage data={data} />;
}
