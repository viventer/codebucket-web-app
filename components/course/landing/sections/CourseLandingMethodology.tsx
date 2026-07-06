import {
  FileTextIcon,
  FileVideoIcon,
  FolderKanbanIcon,
  PuzzleIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export function CourseLandingMethodology() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">
          Najskuteczniejszy sposób nauki programowania
        </h2>
        <p className="text-sm text-muted-foreground">
          Ucz się poprzez ćwiczenia i budowanie projektów zamiast spędzać
          godziny na oglądaniu kursów.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {methodologyItems.map(({ title, description, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center gap-2">
              <Icon className="size-8 text-accent" />
              <CardTitle className="text-lg">{title}</CardTitle>
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
