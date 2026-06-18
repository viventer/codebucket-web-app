import type { VideoContent } from "@/schemas/courseSchema";
import { YoutubeVideo } from "@/components/course/YoutubeVideo";

export function VideoElement({ content }: { content: VideoContent }) {
  const { title, videoUrl } = content;

  return <YoutubeVideo videoUrl={videoUrl} title={title} />;
}
