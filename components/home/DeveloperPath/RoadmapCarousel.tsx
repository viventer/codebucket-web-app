import { DesktopRoadmapCarousel } from "@/components/home/DeveloperPath/DesktopRoadmapCarousel";
import { MobileRoadmapCarousel } from "@/components/home/DeveloperPath/MobileRoadmapCarousel";

export function RoadmapCarousel() {
  return (
    <>
      <MobileRoadmapCarousel />
      <DesktopRoadmapCarousel />
    </>
  );
}
