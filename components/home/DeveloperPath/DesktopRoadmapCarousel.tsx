"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

import { RoadmapCourseCard } from "@/components/home/DeveloperPath/RoadmapCourseCard";
import {
  TimelineArrowAxis,
  TimelineDotAxis,
} from "@/components/home/DeveloperPath/RoadmapTimelineAxis";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ROADMAP_FINAL, ROADMAP_ITEMS } from "@/lib/roadmap/roadmap-content";

export function DesktopRoadmapCarousel() {
  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
    }),
  );

  return (
    <Carousel
      opts={{ loop: false, align: "start" }}
      plugins={[autoplay.current]}
      className="hidden w-full sm:block"
    >
      <CarouselContent className="items-stretch">
        {ROADMAP_ITEMS.map((item) => (
          <CarouselItem
            key={item.title}
            className="sm:basis-1/2 lg:basis-1/3"
          >
            <div className="flex h-full flex-col gap-5">
              <div className="min-h-0 flex-1">
                <RoadmapCourseCard item={item} />
              </div>
              <TimelineDotAxis />
            </div>
          </CarouselItem>
        ))}
        <CarouselItem className="sm:basis-1/2 lg:basis-1/3">
          <div className="flex h-full flex-col gap-5">
            <div className="min-h-0 flex-1">
              <RoadmapCourseCard item={ROADMAP_FINAL} />
            </div>
            <TimelineArrowAxis />
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
