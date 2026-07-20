import {
  FileTextIcon,
  FileVideoIcon,
  FolderKanbanIcon,
  PuzzleIcon,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseLandingMethod } from "@/lib/course/landing-data";

const methodologyItems = [
  {
    title: "Krótkie filmy",
    description:
      "Lekcje trwają kilka minut — uczysz się jednej rzeczy na raz, bez przeciągania.",
    icon: FileVideoIcon,
  },
  {
    title: "Podsumowania",
    description:
      "Ściągi i podsumowania pomagają szybko powtórzyć materiał przed zadaniami.",
    icon: FileTextIcon,
  },
  {
    title: "Interaktywne ćwiczenia",
    description:
      "Od razu ćwiczysz to, czego się nauczyłeś - bez pasywnego oglądania.",
    icon: PuzzleIcon,
  },
  {
    title: "Wspólne projekty",
    description:
      "Budujesz realne strony krok po kroku, ucząc się jak wykorzystać zdobytą wiedzę.",
    icon: FolderKanbanIcon,
  },
] as const;

type CourseLandingMethodologyProps = {
  extraItems?: CourseLandingMethod[];
};

export function CourseLandingMethodology({
  extraItems = [],
}: CourseLandingMethodologyProps) {
  const items: Array<{
    title: string;
    description: string;
    icon: LucideIcon;
  }> = [
    ...methodologyItems,
    ...extraItems.map((item) => ({ ...item, icon: FolderKanbanIcon })),
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-medium text-center">
          Najskuteczniejszy sposób nauki programowania
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          Ucz się poprzez ćwiczenia i budowanie projektów zamiast spędzać
          godziny na oglądaniu kursów.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {items.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="gap-3">
            <CardHeader className="flex flex-row items-center gap-2">
              <Icon className="size-8 text-accent" />
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
