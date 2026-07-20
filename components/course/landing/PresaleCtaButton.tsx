"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PresaleCtaButtonProps = {
  label: string;
  size?: "default" | "lg";
  className?: string;
};

export function PresaleCtaButton({
  label,
  size = "lg",
  className,
}: PresaleCtaButtonProps) {
  function handleClick() {
    // TODO: wire up the presale checkout flow once payments are implemented.
  }

  return (
    <Button
      size={size}
      className={cn(className)}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}
