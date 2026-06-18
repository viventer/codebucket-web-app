import Link from "next/link";

import { Button } from "@/components/ui/button";

import type { NavButtonProps } from "./types";

export function NavButton({
  href,
  children,
  variant = "default",
}: NavButtonProps) {
  if (href) {
    return (
      <Button variant={variant} asChild>
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button variant={variant} disabled>
      {children}
    </Button>
  );
}
