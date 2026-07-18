import { AvailableCourseCard } from "@/components/home/AvailableCourseCard";
import type { AvailableCourseDisplay } from "@/lib/available-courses-content";

type AvailableCoursesProps = {
  courses: AvailableCourseDisplay[];
};

export function AvailableCourses({ courses }: AvailableCoursesProps) {
  return (
    <section className="flex flex-col gap-8">
      <header className="text-center sm:snap-center sm:scroll-mt-8 flex flex-col gap-2 ">
        <h2 className="text-xl tracking-tight sm:text-2xl lg:text-3xl">
          Wybierz <span className="text-accent font-bold">swój kurs</span>
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base leading-tight">
          Wybierz czego chciałbyś się nauczyć i przejdź do działania.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 *:scroll-mt-8 [&>*:not(:first-child)]:snap-center">
        {courses.map((course) => (
          <AvailableCourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
