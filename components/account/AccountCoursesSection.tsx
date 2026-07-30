"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export type AccountCourse = {
  id: string;
  title: string;
};

type AccountCoursesSectionProps = {
  courses: AccountCourse[];
  onNavigate?: () => void;
};

export function AccountCoursesSection({
  courses,
  onNavigate,
}: AccountCoursesSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium">Twoje kursy</h3>

        {courses.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {courses.map((course) => (
              <li
                key={course.id}
                className="flex items-center justify-between gap-4 border-b pb-2"
              >
                <p className="text-sm text-muted-foreground">{course.title}</p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/course/${course.id}`} onClick={onNavigate}>
                    Przejdź do kursu
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nie masz jeszcze żadnych kursów.
          </p>
        )}
      </div>

      <Button className="w-full">
        <PlusIcon />
        Odblokuj nowy kurs
      </Button>
    </section>
  );
}
