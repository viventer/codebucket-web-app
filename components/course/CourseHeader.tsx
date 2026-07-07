import Image from "next/image";

import type { SectionProgress } from "@/lib/course/progress";
import {
  AccountDialog,
  type AccountCourse,
} from "@/components/course/AccountDialog";
import { CourseHeaderProgress } from "@/components/course/CourseHeaderProgress";
import {
  CourseNavSheet,
  type NavSection,
} from "@/components/course/CourseNavSheet";

export type CourseHeaderProps = {
  courseId: string;
  courseTitle: string;
  sectionTitle: string;
  sections: NavSection[];
  currentSectionId: string;
  currentElementId: string;
  progress: SectionProgress;
  account: {
    email: string;
    courses: AccountCourse[];
    currentCourseId?: string;
  };
};

export function CourseHeader({
  courseId,
  courseTitle,
  sectionTitle,
  sections,
  currentSectionId,
  currentElementId,
  progress,
  account,
}: CourseHeaderProps) {
  return (
    <header className="gap-3 border-b bg-background px-3">
      <div className="flex h-14 items-center w-[90vw] mx-auto max-w-[1280px]">
        <div className="flex min-w-0 items-center gap-8">
          <Image
            src="/logo.svg"
            alt="CodeBucket"
            width={28}
            height={28}
            priority
            className="hidden sm:block"
          />
          <section className="flex items-center gap-2 sm:gap-4">
            <CourseNavSheet
              courseId={courseId}
              courseTitle={courseTitle}
              sections={sections}
              currentSectionId={currentSectionId}
              currentElementId={currentElementId}
            />

            <p className="truncate text-sm font-medium text-foreground">
              {sectionTitle}
            </p>

            <div className="flex items-center gap-2">
              <CourseHeaderProgress
                value={progress.percent}
                completed={progress.completed}
                total={progress.total}
              />
            </div>
          </section>
        </div>

        <div className="ml-auto">
          <AccountDialog
            email={account.email}
            courses={account.courses}
            currentCourseId={account.currentCourseId}
          />
        </div>
      </div>
    </header>
  );
}
