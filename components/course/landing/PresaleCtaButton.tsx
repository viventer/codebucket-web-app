"use client";

import { Button } from "@/components/ui/button";
import { ClientIcon } from "@/components/ui/client-icon";
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
      className={cn(
        "gap-2 [&_svg]:pointer-events-auto! [&_svg:not([class*='size-'])]:size-auto",
        className,
      )}
      onClick={handleClick}
    >
      <ClientIcon src="shopping-cart.svg" size={24} />
      {label}
    </Button>
  );
}
