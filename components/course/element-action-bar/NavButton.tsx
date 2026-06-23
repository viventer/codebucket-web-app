"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCourseNavigationOptional } from "@/lib/course/navigation-transition-context";

import type { NavButtonProps } from "./types";

export function NavButton({
  href,
  children,
  variant = "default",
  crossesSection = false,
}: NavButtonProps) {
  const router = useRouter();
  const navigation = useCourseNavigationOptional();

  const handleNavigate = () => {
    if (!href) {
      return;
    }

    navigation?.setNavigationIntent("forward", { crossesSection });
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
