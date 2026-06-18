import type { GuidedProjectContent } from "@/schemas/courseSchema";
import { YoutubeVideo } from "@/components/course/YoutubeVideo";

export function GuidedProjectElement({
  content,
}: {
  content: GuidedProjectContent;
}) {
  const { title, videoUrl } = content;

  return <YoutubeVideo videoUrl={videoUrl} title={title} />;
}
