import { NewsletterCta } from "@/components/home/DeveloperPath/NewsletterCta";
import { RoadmapCarousel } from "@/components/home/DeveloperPath/RoadmapCarousel";
import { SectionHeading } from "@/components/SectionHeading";
import { ROADMAP_HEADING } from "@/lib/roadmap/roadmap-content";

export function DeveloperPath() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading>
        <SectionHeading.Title>{ROADMAP_HEADING.title}</SectionHeading.Title>
        <SectionHeading.Description>
          {ROADMAP_HEADING.description}
        </SectionHeading.Description>
      </SectionHeading>

      <RoadmapCarousel />

      <NewsletterCta />
    </section>
  );
}
