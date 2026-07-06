import { CheckCircle2Icon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseLandingData } from "@/lib/course/landing-data";

type CourseLandingObjectivesProps = Pick<CourseLandingData, "whatYouWillLearn">;

export function CourseLandingObjectives({
  whatYouWillLearn,
}: CourseLandingObjectivesProps) {
  return (
    <Card className="bg-primary/20 ring-0">
      <CardHeader>
        <CardTitle className="text-lg">Czego się nauczysz?</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {whatYouWillLearn.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckCircle2Icon className="size-4 shrink-0 text-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
