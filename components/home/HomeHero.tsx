import { Button } from "../ui/button";
import { ClientIcon } from "../ui/client-icon";
import { HeroGraphic } from "./HeroGraphic";

export function HomeHero() {
  return (
    <section className="flex min-h-[60dvh] max-h-[80dvh] flex-col items-center gap-9 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
      <div className="flex flex-col gap-3 shrink-0 lg:max-w-xl">
        <h1 className="text-2xl tracking-tight sm:text-4xl lg:text-5xl">
          Naucz się programowania{" "}
          <span className="text-accent font-bold">bez marnowania czasu</span>
        </h1>

        <p className="text-sm text-muted-foreground sm:text-base lg:text-lg mb-6 leading-tight">
          Ucz się poprzez ćwiczenia i budowanie projektów zamiast spędzać
          godziny na oglądaniu kursów.
        </p>

        <Button
          asChild
          className="sm:max-w-sm gap-2 py-5 [&_svg]:pointer-events-auto!  [&_svg:not([class*='size-'])]:size-auto"
          size={"lg"}
        >
          <a href="#wybierz-kurs">
            <ClientIcon src="rocket.svg" size={24} />
            <p className="sm:text-lg font-bold">Wybierz kurs</p>
          </a>
        </Button>
      </div>

      <HeroGraphic className="flex-1 min-h-0 w-full max-w-sm xl:max-w-md lg:flex-none lg:h-fit lg:shrink-0 lg:[&>div>svg]:h-auto" />
    </section>
  );
}
