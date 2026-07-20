import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
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
      <h2 className="text-center text-xl font-medium mb-3">
        Najczęściej zadawane pytania
      </h2>
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
