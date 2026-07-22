import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { CourseLandingData } from "@/lib/course/landing-data";

type CourseLandingObjectivesProps = Pick<CourseLandingData, "whatYouWillLearn">;

export function CourseLandingObjectives({
  whatYouWillLearn,
}: CourseLandingObjectivesProps) {
  return (
    <Card className="ring-primary bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Czego się nauczysz?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {whatYouWillLearn.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Icon
                src="check-circle.svg"
                size={16}
                className="shrink-0 text-accent"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
