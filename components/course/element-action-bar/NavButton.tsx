"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCourseNavigationOptional } from "@/lib/course/navigation-transition-context";

import type { NavButtonProps } from "./types";

export function NavButton({
  href,
  children,
  variant = "default",
}: NavButtonProps) {
  const navigation = useCourseNavigationOptional();

  if (href) {
    return (
      <Button variant={variant} asChild>
        <Link
          href={href}
          onClick={() => navigation?.setNavigationIntent("forward")}
        >
          {children}
        </Link>
      </Button>
    );
  }

  return (
    <Button variant={variant} disabled>
      {children}
    </Button>
  );
}
