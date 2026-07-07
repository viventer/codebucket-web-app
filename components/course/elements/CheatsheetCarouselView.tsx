"use client";

import { useEffect, useState } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { CheatsheetSlide } from "@/actions/storage/resolve-element-assets";

type CheatsheetCarouselViewProps = {
  slides: CheatsheetSlide[];
  title: string;
  showNavButtons: boolean | "responsive";
  startIndex?: number;
  onSlideChange?: (index: number) => void;
  setApi?: (api: CarouselApi) => void;
  onImageClick?: () => void;
  className?: string;
  slideClassName?: string;
  imageClassName?: string;
  navPreviousClassName?: string;
  navNextClassName?: string;
};

export function CheatsheetCarouselView({
  slides,
  title,
  showNavButtons,
  startIndex = 0,
  onSlideChange,
  setApi,
  onImageClick,
  className,
  slideClassName,
  imageClassName,
  navPreviousClassName,
  navNextClassName,
}: CheatsheetCarouselViewProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!carouselApi || !onSlideChange) {
      return;
    }

    const syncIndex = () => {
      onSlideChange(carouselApi.selectedScrollSnap());
    };

    syncIndex();
    carouselApi.on("select", syncIndex);

    return () => {
      carouselApi.off("select", syncIndex);
    };
  }, [carouselApi, onSlideChange]);

  const handleSetApi = (api: CarouselApi) => {
    setCarouselApi(api);
    setApi?.(api);
  };

  const renderNavButtons = showNavButtons !== false;

  return (
    <div className={cn("relative mx-auto w-full max-w-[1280px]", className)}>
      <Carousel opts={{ loop: true, startIndex }} setApi={handleSetApi}>
        <CarouselContent className={slideClassName ? "h-full" : undefined}>
          {slides.map((slide) => (
            <CarouselItem
              key={slide.filename}
              className={cn(slideClassName && "h-full")}
            >
              <div
                className={cn(
                  "flex w-full items-center justify-center overflow-hidden rounded-xl bg-card",
                  slideClassName && "h-full bg-transparent",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- Firebase signed URLs */}
                <img
                  src={slide.url}
                  alt={`${title} — ${slide.filename}`}
                  className={cn(
                    "max-h-full max-w-full object-contain",
                    onImageClick && "cursor-pointer",
                    imageClassName,
                  )}
                  onClick={onImageClick}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {renderNavButtons && (
          <>
            <CarouselPrevious
              className={cn(
                showNavButtons === "responsive" && "hidden sm:flex",
                navPreviousClassName,
              )}
            />
            <CarouselNext
              className={cn(
                showNavButtons === "responsive" && "hidden sm:flex",
                navNextClassName,
              )}
            />
          </>
        )}
      </Carousel>
    </div>
  );
}
