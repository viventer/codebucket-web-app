"use client";

import { HomeIcon, MenuIcon } from "lucide-react";
import Link from "next/link";

import type { CourseElement } from "@/schemas/courseSchema";
import {
  CourseSectionsAccordion,
  type CourseSectionsAccordionSection,
} from "@/components/course/CourseSectionsAccordion";
import { Button } from "@/components/ui/button";
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
  type: CourseElement["type"];
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

function toAccordionSections(
  courseId: string,
  sections: NavSection[],
): CourseSectionsAccordionSection[] {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    order: section.order,
    elements: section.elements.map((element) => ({
      id: element.id,
      title: element.title,
      type: element.type,
      completed: element.completed,
      href: `/course/${courseId}/${section.id}/${element.id}`,
    })),
  }));
}

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
          <div className="flex items-center gap-2 pr-8">
            <SheetClose asChild>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/" aria-label="Strona główna">
                  <HomeIcon />
                </Link>
              </Button>
            </SheetClose>
            <SheetTitle className="min-w-0 flex-1 truncate">
              {courseTitle}
            </SheetTitle>
          </div>
        </SheetHeader>
        <nav className="flex-1 overflow-y-auto px-2 pt-2 pb-8">
          <CourseSectionsAccordion
            sections={toAccordionSections(courseId, sections)}
            defaultValue={currentSectionId}
            currentSectionId={currentSectionId}
            currentElementId={currentElementId}
            renderLinkWrapper={(link) => (
              <SheetClose asChild>{link}</SheetClose>
            )}
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
