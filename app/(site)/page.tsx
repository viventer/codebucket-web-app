import { HomeHero } from "@/components/home/HomeHero";
import { getCourseDocument } from "@/actions/courses/read-courses";
import { buildCourseLandingData } from "@/lib/course/landing-data";

const DEFAULT_FREE_COURSE_ID = "html-fundamentals";

export default async function HomePage() {
  const course = await getCourseDocument(DEFAULT_FREE_COURSE_ID);
  const landingData = course ? buildCourseLandingData(course) : null;

  return (
    <main className="mx-auto flex w-[90vw] max-w-[1280px] flex-1 flex-col pt-8 pb-16 sm:pt-16">
      {landingData?.startHref ? (
        <HomeHero
          courseId={landingData.id}
          startHref={landingData.startHref}
          isFree={landingData.isFree}
        />
      ) : null}
    </main>
  );
}
