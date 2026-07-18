import { AvailableCourses } from "@/components/home/AvailableCourses";
import { HomeHero } from "@/components/home/HomeHero";
import { LearningFlow } from "@/components/home/LearningFlow";
import { ScrollSnapController } from "@/components/home/ScrollSnapController";
import { getCourseDocument } from "@/actions/courses/read-courses";
import { buildAvailableCoursesDisplay } from "@/lib/available-courses-content";
import { getPublicStorageUrls } from "@/actions/storage/storage";
import { LEARNING_FLOW_ITEMS } from "@/lib/learning-flow-content";

const AVAILABLE_COURSE_IDS = ["html-fundamentals", "css-basics"] as const;

const VIDEO_STORAGE_PATHS = LEARNING_FLOW_ITEMS.map((item) => item.storagePath);

export default async function HomePage() {
  const [htmlCourse, cssCourse] = await Promise.all(
    AVAILABLE_COURSE_IDS.map((id) => getCourseDocument(id)),
  );
  const availableCourses = buildAvailableCoursesDisplay({
    "html-fundamentals": htmlCourse,
    "css-basics": cssCourse,
  });

  let videoUrls: Record<string, string> = {};
  try {
    videoUrls = await getPublicStorageUrls(VIDEO_STORAGE_PATHS);
  } catch {
    // Videos will be omitted if storage fetch fails
  }

  return (
    <>
      <ScrollSnapController />
      <main className="mx-auto flex w-[90vw] max-w-[1280px] flex-1 flex-col pt-8 pb-24 sm:pb-32 sm:pt-16 gap-24">
        <HomeHero />
        <LearningFlow videoUrls={videoUrls} />
        <AvailableCourses courses={availableCourses} />
      </main>
    </>
  );
}
