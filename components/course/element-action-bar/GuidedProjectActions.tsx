"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCourseNavigationOptional } from "@/lib/course/navigation-transition-context";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
import { DownloadMaterialsButton } from "./DownloadMaterialsButton";
import { NavButton } from "./NavButton";

type GuidedProjectActionsProps = {
  prevHref: string | null;
  nextHref: string | null;
  hasMaterials: boolean;
};

export function GuidedProjectActions({
  prevHref,
  nextHref,
  hasMaterials,
}: GuidedProjectActionsProps) {
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
      {hasMaterials && <DownloadMaterialsButton source="guidedProject" />}
      {prevHref && (
        <Button variant="ghost" onClick={handleBack}>
          <ActionBarButtonLabel label="Cofnij" icon={ChevronLeftIcon} />
        </Button>
      )}
      <NavButton href={nextHref}>
        <ActionBarButtonLabel label="Przejdź dalej" icon={ChevronRightIcon} />
      </NavButton>
    </div>
  );
}
