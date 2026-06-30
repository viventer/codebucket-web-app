"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCourseNavigationOptional } from "@/lib/course/navigation-transition-context";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";

type CourseEndingActionsProps = {
  prevHref: string | null;
  continueHref: string | null;
};

export function CourseEndingActions({
  prevHref,
  continueHref,
}: CourseEndingActionsProps) {
  const router = useRouter();
  const navigation = useCourseNavigationOptional();

  const handleBack = () => {
    if (!prevHref) {
      return;
    }

    navigation?.setNavigationIntent("back");
    router.push(prevHref);
  };

  return (
    <div className="flex w-full items-center justify-end gap-2">
      {prevHref && (
        <Button variant="ghost" onClick={handleBack}>
          <ActionBarButtonLabel label="Cofnij" icon={ChevronLeftIcon} />
        </Button>
      )}
      {continueHref ? (
        <Button asChild>
          <Link href={continueHref}>
            <ActionBarButtonLabel
              label="Kontynuuj naukę"
              icon={ChevronRightIcon}
            />
          </Link>
        </Button>
      ) : (
        <Button disabled>
          <ActionBarButtonLabel
            label="Kontynuuj naukę"
            icon={ChevronRightIcon}
          />
        </Button>
      )}
    </div>
  );
}
