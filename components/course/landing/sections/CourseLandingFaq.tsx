import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/SectionHeading";
import type { CourseLandingFaqItem } from "@/lib/course/landing-data";

type CourseLandingFaqProps = {
  faq: CourseLandingFaqItem[];
};

export function CourseLandingFaq({ faq }: CourseLandingFaqProps) {
  if (faq.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionHeading>
        <SectionHeading.Title>
          Najczęściej zadawane pytania
        </SectionHeading.Title>
      </SectionHeading>
      <Accordion type="single" collapsible className="gap-1">
        {faq.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={`faq-${index}`}
            className="border-none"
          >
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
