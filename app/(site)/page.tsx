import { HomeHero } from "@/components/home/HomeHero";
import { LearningFlow } from "@/components/home/LearningFlow";
import { ScrollSnapController } from "@/components/home/ScrollSnapController";
import { getCourseDocument } from "@/actions/courses/read-courses";
import { buildCourseLandingData } from "@/lib/course/landing-data";
import { getPublicStorageUrls } from "@/actions/storage/storage";
import { LEARNING_FLOW_ITEMS } from "@/lib/learning-flow-content";

const DEFAULT_FREE_COURSE_ID = "html-fundamentals";

const VIDEO_STORAGE_PATHS = LEARNING_FLOW_ITEMS.map((item) => item.storagePath);

export default async function HomePage() {
  const course = await getCourseDocument(DEFAULT_FREE_COURSE_ID);
  const landingData = course ? buildCourseLandingData(course) : null;

  let videoUrls: Record<string, string> = {};
  try {
    videoUrls = await getPublicStorageUrls(VIDEO_STORAGE_PATHS);
  } catch {
    // Videos will be omitted if storage fetch fails
  }

  return (
    <>
      <ScrollSnapController />
      <main className="mx-auto flex w-[90vw] max-w-[1280px] flex-1 flex-col pt-8 pb-16 sm:pt-16">
        {landingData?.startHref ? (
          <HomeHero
            courseId={landingData.id}
            startHref={landingData.startHref}
            isFree={landingData.isFree}
          />
        ) : null}
        <LearningFlow videoUrls={videoUrls} />
      </main>
    </>
  );
}
