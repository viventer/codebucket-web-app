"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCourseNavigationOptional } from "@/lib/course/navigation-transition-context";

import type { NavButtonProps } from "./types";

export function NavButton({
  href,
  children,
  variant = "default",
}: NavButtonProps) {
  const router = useRouter();
  const navigation = useCourseNavigationOptional();

  const handleNavigate = () => {
    if (!href || !navigation) {
      return;
    }

    const { metadata, sectionsCompleted, setNavigationIntent, beginSectionTransition } =
      navigation;

    setNavigationIntent("forward");

    const shouldShowSectionTransition =
      metadata.isNextSectionChange &&
      !sectionsCompleted.includes(metadata.currentSection.id);

    if (shouldShowSectionTransition) {
      beginSectionTransition();
    }

    router.push(href);
  };

  if (href) {
    return (
      <Button variant={variant} onClick={handleNavigate}>
        {children}
      </Button>
    );
  }

  return (
    <Button variant={variant} disabled>
      {children}
    </Button>
  );
}
