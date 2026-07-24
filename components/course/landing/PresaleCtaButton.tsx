"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ClientIcon } from "@/components/ui/client-icon";
import { isGuestUser } from "@/lib/course/guest-progress";
import { cn } from "@/lib/utils";

type PresaleCtaButtonProps = {
  courseId: string;
  label: string;
  size?: "default" | "lg";
  className?: string;
};

export function PresaleCtaButton({
  courseId,
  label,
  size = "lg",
  className,
}: PresaleCtaButtonProps) {
  const router = useRouter();

  function handleClick() {
    const checkoutPath = `/checkout/${courseId}`;

    if (isGuestUser()) {
      const params = new URLSearchParams({
        next: checkoutPath,
        reason: "purchase",
      });
      router.push(`/registration-required?${params.toString()}`);
      return;
    }

    router.push(checkoutPath);
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
