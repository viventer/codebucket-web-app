"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Maximize2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCheatsheetFullscreen } from "@/lib/course/cheatsheet-fullscreen-context";
import { useCourseNavigationOptional } from "@/lib/course/navigation-transition-context";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
import { DownloadCheatsheetButton } from "./DownloadCheatsheetButton";
import { NavButton } from "./NavButton";

type CheatsheetActionsProps = {
  prevHref: string | null;
  nextHref: string | null;
};

export function CheatsheetActions({
  prevHref,
  nextHref,
}: CheatsheetActionsProps) {
  const router = useRouter();
  const navigation = useCourseNavigationOptional();
  const { enterFullscreen, slidesCount } = useCheatsheetFullscreen();

  const handleBack = () => {
    if (!prevHref) {
      return;
    }

    navigation?.setNavigationIntent("back");
    router.push(prevHref);
  };

  return (
    <div className="flex w-full items-center justify-end gap-2">
      <DownloadCheatsheetButton />
      <Button
        variant="ghost"
        onClick={enterFullscreen}
        disabled={slidesCount === 0}
      >
        <ActionBarButtonLabel label="Pełny ekran" icon={Maximize2Icon} />
      </Button>
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
