import { CheckCircle2Icon, CheckIcon } from "lucide-react";

import { ClientIcon } from "@/components/ui/client-icon";
import type { CourseEndingContent } from "@/schemas/courseSchema";
import { getCourseCardData } from "@/lib/courses";

import { RecommendedCourseCard } from "./RecommendedCourseCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CourseEndingElementProps = {
  content: CourseEndingContent;
};

export function CourseEndingElement({ content }: CourseEndingElementProps) {
  const { congrats, obtainedSkills, nextSteps } = content;

  const recommendedCourses = nextSteps.recommendedCourseIds
    .map((id) => getCourseCardData(id))
    .filter((course) => course !== null);

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
          <h2 className="text-lg font-semibold">Czego się nauczyłeś?</h2>
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
          <h2 className="text-lg font-semibold">{nextSteps.heading}</h2>
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
