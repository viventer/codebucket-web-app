import { AvailableCourseCard } from "@/components/home/AvailableCourseCard";
import { SectionHeading } from "@/components/SectionHeading";
import type { AvailableCourseDisplay } from "@/lib/course/available-courses";

type AvailableCoursesProps = {
  courses: AvailableCourseDisplay[];
};

export function AvailableCourses({ courses }: AvailableCoursesProps) {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading className="sm:snap-start sm:scroll-mt-8">
        <SectionHeading.Title>
          Wybierz <span className="text-accent font-bold">swój kurs</span>
        </SectionHeading.Title>
        <SectionHeading.Description className="leading-tight sm:text-base">
          Wybierz czego chciałbyś się nauczyć i przejdź do działania.
        </SectionHeading.Description>
      </SectionHeading>

      <div className="grid gap-8 md:grid-cols-2">
        {courses.map((course) => (
          <AvailableCourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
