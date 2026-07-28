import type { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type HelpFaqItem = {
  question: string;
  answer: ReactNode;
};

type HelpFaqProps = {
  items: HelpFaqItem[];
};

export function HelpFaq({ items }: HelpFaqProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Accordion type="single" collapsible>
      {items.map((item) => (
        <AccordionItem key={item.question} value={item.question}>
          <AccordionTrigger className="sm:text-base">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm sm:text-base">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
