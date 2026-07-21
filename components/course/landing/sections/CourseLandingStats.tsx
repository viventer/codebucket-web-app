import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { CourseLandingData } from "@/lib/course/landing-data";
import { Button } from "@/components/ui/button";

type CourseLandingStatsProps = Pick<
  CourseLandingData,
  "durationLabel" | "levelLabel" | "prerequisites"
>;

const stats = [
  {
    key: "duration",
    label: "Czas trwania",
    icon: "clock.svg",
    getValue: (data: CourseLandingStatsProps) => data.durationLabel,
  },
  {
    key: "level",
    label: "Poziom",
    icon: "graduation-cap.svg",
    getValue: (data: CourseLandingStatsProps) => data.levelLabel,
  },
] as const;

export function CourseLandingStats({
  durationLabel,
  levelLabel,
  prerequisites,
}: CourseLandingStatsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {stats.map(({ key, label, icon, getValue }) => (
        <Card key={key} className="gap-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-light">
              <Icon src={icon} size={20} className="text-accent" />
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">
              {getValue({ durationLabel, levelLabel, prerequisites })}
            </p>
          </CardContent>
        </Card>
      ))}

      <Card className="gap-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-light">
            <Icon src="checklist.svg" size={20} className="text-accent" />
            Wymagania wstępne
          </CardTitle>
        </CardHeader>
        <CardContent>
          {prerequisites.length === 0 ? (
            <p className="text-lg font-medium">Brak</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {prerequisites.map((prerequisite) => (
                <li
                  key={prerequisite.label}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg font-medium"
                >
                  <span>{prerequisite.label}</span>
                  {prerequisite.courseHref ? (
                    <Button
                      asChild
                      variant="secondary"
                      size="sm"
                      className="font-normal"
                    >
                      <Link href={prerequisite.courseHref}>zobacz kurs</Link>
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
