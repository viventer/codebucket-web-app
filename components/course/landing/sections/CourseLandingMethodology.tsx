import { SectionHeading } from "@/components/SectionHeading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { CourseLandingMethod } from "@/lib/course/landing-data";

const methodologyItems = [
  {
    title: "Krótkie filmy",
    description:
      "Lekcje trwają kilka minut — uczysz się jednej rzeczy na raz, bez przeciągania.",
    icon: "clapperboard.svg",
  },
  {
    title: "Podsumowania",
    description:
      "Ściągi i podsumowania pomagają szybko powtórzyć materiał przed zadaniami.",
    icon: "file-text.svg",
  },
  {
    title: "Interaktywne ćwiczenia",
    description:
      "Od razu ćwiczysz to, czego się nauczyłeś - bez pasywnego oglądania.",
    icon: "gamepad.svg",
  },
  {
    title: "Wspólne projekty",
    description:
      "Budujesz realne strony krok po kroku, ucząc się jak wykorzystać zdobytą wiedzę.",
    icon: "ruler-cross-pen.svg",
  },
] as const;

type CourseLandingMethodologyProps = {
  extraItems?: CourseLandingMethod[];
};

export function CourseLandingMethodology({
  extraItems = [],
}: CourseLandingMethodologyProps) {
  const items = [...methodologyItems, ...extraItems];

  return (
    <section className="flex flex-col gap-6">
      <SectionHeading>
        <SectionHeading.Title>
          Najskuteczniejszy sposób nauki programowania
        </SectionHeading.Title>
        <SectionHeading.Description>
          Ucz się poprzez ćwiczenia i budowanie projektów zamiast spędzać
          godziny na oglądaniu kursów.
        </SectionHeading.Description>
      </SectionHeading>

      <div className="grid gap-6 sm:grid-cols-2">
        {items.map(({ title, description, icon }) => (
          <Card key={title} className="gap-3">
            <CardHeader className="flex flex-row items-center gap-2">
              <Icon src={icon} size={32} className="text-accent" />
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
