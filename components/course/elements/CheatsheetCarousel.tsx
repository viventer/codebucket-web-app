"use client";

import { useEffect, useRef } from "react";

import { useCheatsheetFullscreen } from "@/lib/course/cheatsheet-fullscreen-context";
import type { CarouselApi } from "@/components/ui/carousel";
import type { CheatsheetSlide } from "@/lib/course/resolve-element-assets";

import { CheatsheetCarouselView } from "./CheatsheetCarouselView";
import { CheatsheetFullscreenOverlay } from "./CheatsheetFullscreenOverlay";

type CheatsheetCarouselProps = {
  slides: CheatsheetSlide[];
  title: string;
};

export function CheatsheetCarousel({ slides, title }: CheatsheetCarouselProps) {
  const {
    isFullscreen,
    slideIndex,
    setSlideIndex,
    setSlidesCount,
    enterFullscreen,
  } = useCheatsheetFullscreen();
  const inlineApiRef = useRef<CarouselApi | null>(null);
  const wasFullscreenRef = useRef(false);

  useEffect(() => {
    setSlidesCount(slides.length);
  }, [setSlidesCount, slides.length]);

  useEffect(() => {
    if (wasFullscreenRef.current && !isFullscreen) {
      inlineApiRef.current?.scrollTo(slideIndex);
    }

    wasFullscreenRef.current = isFullscreen;
  }, [isFullscreen, slideIndex]);

  if (slides.length === 0) {
    return (
      <div className="flex w-full items-center justify-center rounded-xl bg-card">
        <p className="text-sm text-muted-foreground">Brak plików ściągi</p>
      </div>
    );
  }

  return (
    <>
      <CheatsheetCarouselView
        slides={slides}
        title={title}
        showNavButtons="responsive"
        onSlideChange={setSlideIndex}
        setApi={(api) => {
          inlineApiRef.current = api;
        }}
        onImageClick={enterFullscreen}
        className="sm:px-12"
        imageClassName="max-sm:max-h-[calc(100dvh-10.5rem)]"
      />
      <CheatsheetFullscreenOverlay slides={slides} title={title} />
    </>
  );
}
