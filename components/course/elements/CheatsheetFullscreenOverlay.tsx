"use client";

import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { useCheatsheetFullscreen } from "@/lib/course/cheatsheet-fullscreen-context";
import { cn } from "@/lib/utils";
import type { CheatsheetSlide } from "@/lib/course/resolve-element-assets";
import { CheatsheetCarouselView } from "./CheatsheetCarouselView";

type CheatsheetFullscreenOverlayProps = {
  slides: CheatsheetSlide[];
  title: string;
};

export function CheatsheetFullscreenOverlay({
  slides,
  title,
}: CheatsheetFullscreenOverlayProps) {
  const {
    isFullscreen,
    slideIndex,
    setSlideIndex,
    registerOverlayElement,
    exitFullscreen,
  } = useCheatsheetFullscreen();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      ref={registerOverlayElement}
      aria-hidden={!isFullscreen}
      className={cn(
        "fixed inset-0 z-50 flex h-dvh w-dvw flex-col bg-background",
        !isFullscreen && "hidden",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 z-10 touch-manipulation"
        onClick={exitFullscreen}
      >
        <XIcon />
        <span className="sr-only">Zamknij pełny ekran</span>
      </Button>

      <div className="flex min-h-0 flex-1 items-center justify-center px-4 sm:px-12">
        <CheatsheetCarouselView
          slides={slides}
          title={title}
          startIndex={slideIndex}
          showNavButtons="responsive"
          navPreviousClassName="hidden sm:flex -left-4 sm:-left-12"
          navNextClassName="hidden sm:flex -right-4 sm:-right-12"
          slideClassName="h-full"
          imageClassName="max-h-full max-w-full object-contain"
          onSlideChange={setSlideIndex}
        />
      </div>
    </div>,
    document.body,
  );
}
