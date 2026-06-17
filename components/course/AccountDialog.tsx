"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export type AccountCourse = {
  id: string;
  title: string;
};

export type AccountDialogProps = {
  email: string;
  courses: AccountCourse[];
  currentCourseId?: string;
};

export function AccountDialog({
  email,
  courses,
  currentCourseId,
}: AccountDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Twoje konto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Twoje konto
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-8">
          <section className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-foreground">Email</h3>
            <p className="text-sm text-muted-foreground">{email}</p>
          </section>

          <Separator />

          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-foreground">
                Twoje kursy
              </h3>

              {courses.length > 0 ? (
                <ul className="flex flex-col gap-4">
                  {courses.map((course) => (
                    <li
                      key={course.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <p className="text-sm text-muted-foreground">
                        {course.title}
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/course/${course.id}`}>
                          {course.id === currentCourseId
                            ? "Przejdź do kursu"
                            : "Otwórz"}
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

          <p className="mt-2 text-center text-sm text-muted-foreground">
            Napotkałeś na jakieś problemy?{" "}
            <Link
              href="/help"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Pomoc
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
