import { ClockIcon, GraduationCapIcon, ListChecksIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseLandingData } from "@/lib/course/landing-data";

type CourseLandingStatsProps = Pick<
  CourseLandingData,
  "durationLabel" | "levelLabel" | "prerequisitesLabel"
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
  {
    key: "prerequisites",
    label: "Wymagania wstępne",
    icon: ListChecksIcon,
    getValue: (data: CourseLandingStatsProps) => data.prerequisitesLabel,
  },
] as const;

export function CourseLandingStats(props: CourseLandingStatsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {stats.map(({ key, label, icon: Icon, getValue }) => (
        <Card key={key} className="gap-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-light">
              <Icon className="size-5 text-accent" />
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{getValue(props)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
