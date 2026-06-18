"use client";

import Link from "next/link";
import { CircleCheckIcon, CircleIcon, MenuIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export type NavElement = {
  id: string;
  title: string;
  completed: boolean;
};

export type NavSection = {
  id: string;
  title: string;
  order: number;
  elements: NavElement[];
};

export type CourseNavSheetProps = {
  courseId: string;
  courseTitle: string;
  sections: NavSection[];
  currentSectionId: string;
  currentElementId: string;
};

export function CourseNavSheet({
  courseId,
  courseTitle,
  sections,
  currentSectionId,
  currentElementId,
}: CourseNavSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Otwórz nawigację kursu">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 gap-0 sm:max-w-sm">
        <SheetHeader className="border-b">
          <SheetTitle>{courseTitle}</SheetTitle>
        </SheetHeader>
        <nav className="flex-1 overflow-y-auto px-2 pt-2 pb-8">
          <Accordion
            type="single"
            collapsible
            defaultValue={currentSectionId}
            className="gap-1"
          >
            {sections.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border-none"
              >
                <AccordionTrigger className="px-2flex items-center gap-2">
                  <p className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-muted text-base font-medium ">
                    {section.order}
                  </p>
                  <p>{section.title}</p>
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <ul className="flex flex-col gap-2">
                    {section.elements.map((element) => {
                      const isCurrent =
                        section.id === currentSectionId &&
                        element.id === currentElementId;

                      return (
                        <li key={element.id}>
                          <SheetClose asChild>
                            <Link
                              href={`/course/${courseId}/${section.id}/${element.id}`}
                              aria-current={isCurrent ? "page" : undefined}
                              className={cn(
                                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm no-underline! transition-colors hover:bg-muted",
                                isCurrent
                                  ? "bg-muted font-medium text-foreground"
                                  : "text-muted-foreground",
                              )}
                            >
                              {element.completed ? (
                                <CircleCheckIcon className="size-4 shrink-0 text-green-500" />
                              ) : (
                                <CircleIcon className="size-4 shrink-0 text-muted-foreground/50" />
                              )}
                              <p className="truncate">{element.title}</p>
                            </Link>
                          </SheetClose>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
