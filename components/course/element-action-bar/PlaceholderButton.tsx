import { Button } from "@/components/ui/button";

import type { PlaceholderButtonProps } from "./types";

export function PlaceholderButton({
  children,
  variant = "outline",
}: PlaceholderButtonProps) {
  return (
    <Button variant={variant} disabled>
      {children}
    </Button>
  );
}
