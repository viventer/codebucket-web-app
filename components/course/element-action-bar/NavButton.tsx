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

    const {
      metadata,
      sectionsCompleted,
      elementsCompleted,
      setNavigationIntent,
      beginSectionTransition,
      beginExerciseTransition,
    } = navigation;

    setNavigationIntent("forward");

    const shouldShowSectionTransition =
      metadata.isNextSectionChange &&
      !sectionsCompleted.includes(metadata.currentSection.id);

    const isExercise =
      metadata.currentElement.type === "platformCodeExercise" ||
      metadata.currentElement.type === "localCodeExercise" ||
      metadata.currentElement.type === "interactiveExercise" ||
      metadata.currentElement.type === "customExercise";

    const isFirstExerciseCompletion = !elementsCompleted.includes(
      metadata.currentElement.id,
    );

    if (shouldShowSectionTransition) {
      beginSectionTransition();
    } else if (
      isExercise &&
      isFirstExerciseCompletion &&
      !metadata.isNextSectionChange &&
      metadata.nextElement !== null
    ) {
      beginExerciseTransition();
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
