"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CheatsheetSlide } from "@/lib/course/resolve-element-assets";

type CheatsheetCarouselProps = {
  slides: CheatsheetSlide[];
  title: string;
};

export function CheatsheetCarousel({ slides, title }: CheatsheetCarouselProps) {
  if (slides.length === 0) {
    return (
      <div className="flex  w-full items-center justify-center rounded-xl bg-card">
        <p className="text-sm text-muted-foreground">Brak plików ściągi</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-12">
      <Carousel>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.filename}>
              <div className="flex w-full items-center justify-center overflow-hidden rounded-xl bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element -- Firebase signed URLs */}
                <img
                  src={slide.url}
                  alt={`${title} — ${slide.filename}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
