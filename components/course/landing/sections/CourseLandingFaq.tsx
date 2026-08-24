import Link from "next/link";

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

const FAQ_LINK_CLASS_NAME =
  "underline underline-offset-2 decoration-accent hover:no-underline";

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
              {item.question === "Jak mogę uzyskać zwrot wpłaty?" ? (
                <>
                  Wypełnij{" "}
                  <Link href="/refund/request" className={FAQ_LINK_CLASS_NAME}>
                    formularz zwrotu
                  </Link>
                  . Pełne zasady znajdziesz na stronie{" "}
                  <Link href="/refund" className={FAQ_LINK_CLASS_NAME}>
                    Zasady zwrotów
                  </Link>
                  . Zwrot środków zostanie zrealizowany tą samą metodą
                  płatności.
                </>
              ) : (
                item.answer
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
