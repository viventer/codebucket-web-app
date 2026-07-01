"use client";

import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";

import { getYouTubeEmbedUrl } from "@/lib/videos";
import { cn } from "@/lib/utils";

type YoutubeVideoProps = {
  videoUrl: string;
  title: string;
};

export function YoutubeVideo({ videoUrl, title }: YoutubeVideoProps) {
  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [embedUrl]);

  return (
    <div className="mx-auto w-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-card shadow-md">
        {embedUrl ? (
          <>
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center bg-black transition-opacity duration-300",
                isLoaded ? "pointer-events-none opacity-0" : "opacity-100",
              )}
              aria-hidden={isLoaded}
            >
              <Loader2Icon className="size-10 animate-spin text-muted-foreground" />
              <span className="sr-only">Ładowanie filmu...</span>
            </div>
            <iframe
              src={embedUrl}
              title={title}
              className={cn(
                "h-full w-[90vw] transition-opacity duration-300",
                isLoaded ? "opacity-100" : "opacity-0",
              )}
              onLoad={() => setIsLoaded(true)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Nie udało się załadować filmu.
          </div>
        )}
      </div>
    </div>
  );
}
