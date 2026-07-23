"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {
  ROADMAP_FINAL,
  ROADMAP_ITEMS,
  type RoadmapItem,
} from "@/lib/roadmap/roadmap-content";
import { cn } from "@/lib/utils";

function RoadmapCourseCard({ item }: { item: RoadmapItem }) {
  const content = (
    <Card className="h-full">
      <CardContent className="flex h-full items-center gap-3">
        <Image
          src={item.logo}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0"
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="font-medium leading-tight">{item.title}</p>
          <p className="text-sm text-muted-foreground leading-snug">
            {item.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}

function TimelineDotAxis({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div
        className="absolute top-1.5 -right-2 -left-2 h-0.5 bg-border"
        aria-hidden
      />
      <span className="relative z-10 size-3 rounded-full bg-foreground" />
    </div>
  );
}

function TimelineArrowAxis({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div
        className="absolute top-1.5 right-3 left-0 h-0 border-t-2 border-dashed border-foreground/60"
        aria-hidden
      />
      <span
        aria-hidden
        className="absolute top-0 right-0 size-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-foreground"
      />
      <span className="size-3 shrink-0" aria-hidden />
    </div>
  );
}

export function RoadmapCarousel() {
  // Stable plugin instance — recreating Autoplay on each render breaks autoplay.
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
      className="w-full"
    >
      <CarouselContent className="items-stretch">
        {ROADMAP_ITEMS.map((item) => (
          <CarouselItem
            key={item.title}
            className="basis-full md:basis-1/2 lg:basis-1/3"
          >
            <div className="flex h-full flex-col gap-5">
              <div className="min-h-0 flex-1">
                <RoadmapCourseCard item={item} />
              </div>
              <TimelineDotAxis />
            </div>
          </CarouselItem>
        ))}
        <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3">
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
