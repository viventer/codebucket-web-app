import type { CourseEndingContent } from "@/schemas/courseSchema";
import type { CourseCardData } from "@/actions/courses/types";

import { RecommendedCourseCard } from "./RecommendedCourseCard";
import { Card, CardContent } from "@/components/ui/card";
import { ClientIcon } from "@/components/ui/client-icon";
import { CheckCircle2Icon } from "lucide-react";

type CourseEndingElementProps = {
  content: CourseEndingContent;
  recommendedCourses: CourseCardData[];
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
          src="cup.svg"
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
        <div>
          <h2 className="text-lg font-medium">Czego się nauczyłeś?</h2>
          <p className="text-sm text-muted-foreground">
            Umiejętności, które przybliżają Cię do Twojego celu.
          </p>
        </div>
        <Card>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {obtainedSkills.map((skill) => (
                <li key={skill} className="flex items-center gap-2 text-base">
                  <CheckCircle2Icon className="size-4 text-feedback-success" />
                  <p>{skill}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-medium">{nextSteps.heading}</h2>
          <p className="text-sm text-muted-foreground">
            Ukończ kolejny kurs i zdobądź nowe umiejętności.
          </p>
        </div>
        <div className="grid gap-4">
          {recommendedCourses.map((course) => (
            <RecommendedCourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
