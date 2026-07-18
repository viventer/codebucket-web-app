import { readFileSync } from "node:fs";
import { join } from "node:path";

import { prepareHeroSvg } from "@/lib/icons/prepare-hero-svg";
import { cn } from "@/lib/utils";

const heroSvgCache = new Map<string, string>();

function loadHeroSvg(filename: string): string {
  const cached = heroSvgCache.get(filename);
  if (cached) return cached;

  const svg = prepareHeroSvg(
    readFileSync(join(process.cwd(), "public", filename), "utf-8"),
  );
  heroSvgCache.set(filename, svg);
  return svg;
}

const portraitSvg = loadHeroSvg("hero-graphic-portrait.svg");
const landscapeSvg = loadHeroSvg("hero-graphic-landscape.svg");

type HeroGraphicProps = {
  className?: string;
};

export function HeroGraphic({ className }: HeroGraphicProps) {
  return (
    <div
      className={cn(
        "min-h-0 w-full [&>div>svg]:block [&>div>svg]:h-full [&>div>svg]:w-full [&>div>svg]:object-contain",
        className,
      )}
      aria-hidden
    >
      <div
        className="hidden h-full w-full [@media(orientation:portrait)]:block"
        dangerouslySetInnerHTML={{ __html: landscapeSvg }}
      />
      <div
        className="block h-full w-full [@media(orientation:portrait)]:hidden"
        dangerouslySetInnerHTML={{ __html: portraitSvg }}
      />
    </div>
  );
}
