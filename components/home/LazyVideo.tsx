"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { Button } from "@/components/ui/button";

type LazyVideoProps = {
  src: string | undefined;
  className?: string;
  isActive?: boolean;
};

export function LazyVideo({ src, className, isActive = true }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [pausedByUser, setPausedByUser] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const shouldPlay = isActive && !pausedByUser && !prefersReducedMotion;
    if (shouldPlay) {
      video.play().catch(() => {
        // Autoplay may be blocked; silent fail
      });
    } else {
      video.pause();
    }
  }, [isActive, pausedByUser, prefersReducedMotion]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      setPausedByUser(false);
      video.play().catch(() => {
        // Playback may be blocked; silent fail
      });
      return;
    }

    setPausedByUser(true);
    video.pause();
  };

  if (!src) return null;

  return (
    <div className="relative h-full w-full sm:min-w-[720px]">
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className={cn("h-full w-full object-cover", className)}
      />
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute right-2 bottom-2 size-9 bg-background/50 backdrop-blur-sm"
        aria-label={isPlaying ? "Zatrzymaj wideo" : "Odtwórz wideo"}
        onClick={togglePlayback}
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>
    </div>
  );
}
