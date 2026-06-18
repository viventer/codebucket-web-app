import { getYouTubeEmbedUrl } from "@/lib/videos";

type YoutubeVideoProps = {
  videoUrl: string;
  title: string;
};

export function YoutubeVideo({ videoUrl, title }: YoutubeVideoProps) {
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="mx-auto w-full">
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-md">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Nie udało się załadować filmu.
          </div>
        )}
      </div>
    </div>
  );
}
