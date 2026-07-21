"use client";

import Link from "next/link";
import type { ReactElement } from "react";

import { ELEMENT_TYPE_ICONS } from "@/components/course/element-action-bar/element-type-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ClientIcon } from "@/components/ui/client-icon";
import { cn } from "@/lib/utils";
import type { CourseElement } from "@/schemas/courseSchema";

export type CourseSectionsAccordionElement = {
  id: string;
  title: string;
  type: CourseElement["type"];
  href: string;
  completed?: boolean;
};

export type CourseSectionsAccordionSection = {
  id: string;
  title: string;
  order: number;
  description?: string;
  elements: CourseSectionsAccordionElement[];
};

type CourseSectionsAccordionProps = {
  sections: CourseSectionsAccordionSection[];
  defaultValue?: string;
  currentSectionId?: string;
  currentElementId?: string;
  showDescription?: boolean;
  renderLinkWrapper?: (link: ReactElement) => ReactElement;
};

export function CourseSectionsAccordion({
  sections,
  defaultValue,
  currentSectionId,
  currentElementId,
  showDescription = false,
  renderLinkWrapper,
}: CourseSectionsAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultValue}
      className="gap-1"
    >
      {sections.map((section) => (
        <AccordionItem
          key={section.id}
          value={section.id}
          className="border-none"
        >
          <AccordionTrigger className="flex items-center gap-2">
            <p className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-muted text-base font-medium">
              {section.order}
            </p>
            <p>{section.title}</p>
          </AccordionTrigger>
          <AccordionContent className="pb-1">
            {showDescription && section.description ? (
              <p className="mb-2 px-2 text-sm text-muted-foreground">
                {section.description}
              </p>
            ) : null}
            <ul className="flex flex-col gap-2">
              {section.elements.map((element) => {
                const isCurrent =
                  section.id === currentSectionId &&
                  element.id === currentElementId;
                const link = (
                  <Link
                    href={element.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm no-underline! transition-colors hover:bg-muted",
                      isCurrent
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    <ClientIcon
                      src={ELEMENT_TYPE_ICONS[element.type]}
                      size={16}
                      className={cn(
                        "shrink-0",
                        element.completed
                          ? "text-feedback-success"
                          : "text-muted-foreground",
                      )}
                    />
                    <p className="truncate">{element.title}</p>
                  </Link>
                );

                return (
                  <li key={element.id}>
                    {renderLinkWrapper ? renderLinkWrapper(link) : link}
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
