import type { CourseEndingContent } from "@/schemas/courseSchema";
import type { AvailableCourseDisplay } from "@/lib/course/available-courses";

import { AvailableCourseCard } from "@/components/home/AvailableCourseCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { ClientIcon } from "@/components/ui/client-icon";
import { Icon } from "@/components/ui/icon";

type CourseEndingElementProps = {
  content: CourseEndingContent;
  recommendedCourses: AvailableCourseDisplay[];
};

export function CourseEndingElement({
  content,
  recommendedCourses,
}: CourseEndingElementProps) {
  const { congrats, obtainedSkills, nextSteps } = content;

  return (
    <div className="mx-auto max-w-xl flex flex-col gap-16">
      <section className="flex flex-col items-center gap-2 text-center">
        <ClientIcon
          src="trophy.svg"
          size={72}
          className="text-feedback-success"
          label="Gratulacje"
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {congrats.heading}
          </h1>
          <p className="text-base text-muted-foreground">
            {congrats.subheading}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading>
          <SectionHeading.Title>Czego się nauczyłeś?</SectionHeading.Title>
          <SectionHeading.Description>
            Umiejętności, które przybliżają Cię do Twojego celu.
          </SectionHeading.Description>
        </SectionHeading>
        <Card>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {obtainedSkills.map((skill) => (
                <li key={skill} className="flex items-center gap-2 text-base">
                  <Icon
                    src="check-circle.svg"
                    size={16}
                    className="text-feedback-success"
                  />
                  <p>{skill}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading>
          <SectionHeading.Title>{nextSteps.heading}</SectionHeading.Title>
          <SectionHeading.Description>
            Ukończ kolejny kurs i zdobądź nowe umiejętności.
          </SectionHeading.Description>
        </SectionHeading>
        <div className="grid gap-4">
          {recommendedCourses.map((course) => (
            <AvailableCourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
