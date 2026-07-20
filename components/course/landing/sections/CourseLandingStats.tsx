import Link from "next/link";
import { ClockIcon, GraduationCapIcon, ListChecksIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    icon: ClockIcon,
    getValue: (data: CourseLandingStatsProps) => data.durationLabel,
  },
  {
    key: "level",
    label: "Poziom",
    icon: GraduationCapIcon,
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
      {stats.map(({ key, label, icon: Icon, getValue }) => (
        <Card key={key} className="gap-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-light">
              <Icon className="size-5 text-accent" />
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
            <ListChecksIcon className="size-5 text-accent" />
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
