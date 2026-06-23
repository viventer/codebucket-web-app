"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCourseNavigationOptional } from "@/lib/course/navigation-transition-context";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";

type ElementBackActionProps = {
  prevHref: string | null;
};

export function ElementBackAction({ prevHref }: ElementBackActionProps) {
  const router = useRouter();
  const navigation = useCourseNavigationOptional();

  if (!prevHref) {
    return null;
  }

  const handleBack = () => {
    navigation?.setNavigationIntent("back");
    router.push(prevHref);
  };

  return (
    <Button variant="ghost" onClick={handleBack}>
      <ActionBarButtonLabel label="Cofnij" icon={ChevronLeftIcon} />
    </Button>
  );
}
