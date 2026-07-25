import Image from "next/image";

import { cn } from "@/lib/utils";

type OrderedCourseSectionProps = {
  courseTitle: string;
  courseDescription: string;
  courseImageUrl: string;
  variant?: "default" | "failed";
};

export function OrderedCourseSection({
  courseTitle,
  courseDescription,
  courseImageUrl,
  variant = "default",
}: OrderedCourseSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-medium mb-1">Zamówiony kurs</h2>
      <div
        className={cn(
          "rounded-lg p-3 flex items-center gap-2 ring-1",
          variant === "failed"
            ? "ring-destructive bg-destructive/10"
            : "ring-accent bg-accent/10",
        )}
      >
        <Image
          src={courseImageUrl}
          alt=""
          width={48}
          height={48}
          className="size-10 shrink-0"
        />
        <div className="flex flex-col">
          <p className="font-medium">{courseTitle}</p>
          <p className="text-muted-foreground text-sm">{courseDescription}</p>
        </div>
      </div>
    </section>
  );
}
