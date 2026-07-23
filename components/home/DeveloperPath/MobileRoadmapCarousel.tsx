"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

import { MobileRoadmapItem } from "@/components/home/DeveloperPath/MobileRoadmapItem";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  ROADMAP_FINAL,
  ROADMAP_ITEMS,
  type RoadmapItem,
} from "@/lib/roadmap/roadmap-content";

const ROADMAP_SLIDES: RoadmapItem[] = [...ROADMAP_ITEMS, ROADMAP_FINAL];

export function MobileRoadmapCarousel() {
  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
    }),
  );

  return (
    <Carousel
      orientation="vertical"
      opts={{ loop: false, align: "start" }}
      plugins={[autoplay.current]}
      className="w-full sm:hidden"
    >
      <CarouselContent className="mt-0 h-72">
        {ROADMAP_SLIDES.map((item, index) => {
          const isLast = index === ROADMAP_SLIDES.length - 1;

          return (
            <CarouselItem key={item.title} className="basis-1/3 pt-0">
              <MobileRoadmapItem item={item} isLast={isLast} />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
