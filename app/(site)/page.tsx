import { AvailableCourses } from "@/components/home/AvailableCourses";
import { HomeHero } from "@/components/home/HomeHero";
import { LearningFlow } from "@/components/home/LearningFlow";
import { MainContainer } from "@/components/MainContainer";
import { ScrollSnapController } from "@/components/home/ScrollSnapController";
import {
  getCourseDocument,
  listCourseIds,
} from "@/actions/courses/read-courses";
import { buildAvailableCoursesDisplay } from "@/lib/course/available-courses";
import { getPublicStorageUrls } from "@/actions/storage/storage";
import { LEARNING_FLOW_ITEMS } from "@/lib/learning-flow-content";
import type { CourseDocument } from "@/schemas/courseSchema";

const VIDEO_STORAGE_PATHS = LEARNING_FLOW_ITEMS.map((item) => item.storagePath);

export default async function HomePage() {
  const courseIds = await listCourseIds();
  const courseDocs = await Promise.all(
    courseIds.map((id) => getCourseDocument(id)),
  );
  const availableCourses = buildAvailableCoursesDisplay(
    courseDocs.filter((doc): doc is CourseDocument => doc !== null),
  );

  let videoUrls: Record<string, string> = {};
  try {
    videoUrls = await getPublicStorageUrls(VIDEO_STORAGE_PATHS);
  } catch {
    // Videos will be omitted if storage fetch fails
  }

  return (
    <>
      <ScrollSnapController />
      <MainContainer>
        <HomeHero />
        <LearningFlow videoUrls={videoUrls} />
        <AvailableCourses courses={availableCourses} />
      </MainContainer>
    </>
  );
}
