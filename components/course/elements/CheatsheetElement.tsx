import type { CheatsheetContent } from "@/schemas/courseSchema";
import { resolveCheatsheetAssets } from "@/actions/storage/resolve-element-assets";

import { CheatsheetCarousel } from "./CheatsheetCarousel";

type CheatsheetElementProps = {
  courseId: string;
  cheatsheetId: string;
  content: CheatsheetContent;
};

export async function CheatsheetElement({
  courseId,
  cheatsheetId,
  content,
}: CheatsheetElementProps) {
  const { slides } = await resolveCheatsheetAssets(courseId, cheatsheetId);

  return <CheatsheetCarousel slides={slides} title={content.title} />;
}
