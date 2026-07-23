"use client";

import { useTransition } from "react";

import { updateNewsletter } from "@/actions/user/update-newsletter";
import { NewsletterDialog } from "@/components/home/DeveloperPath/NewsletterDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ROADMAP_CTA } from "@/lib/roadmap/roadmap-content";

type NewsletterCtaButtonProps = {
  isAuthenticated: boolean;
  className?: string;
};

export function NewsletterCtaButton({
  isAuthenticated,
  className,
}: NewsletterCtaButtonProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleAuthenticatedJoin() {
    startTransition(async () => {
      const result = await updateNewsletter(true);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Dołączono do newslettera.");
    });
  }

  if (isAuthenticated) {
    return (
      <Button
        onClick={handleAuthenticatedJoin}
        disabled={isPending}
        className={className}
      >
        {isPending ? "Zapisywanie..." : ROADMAP_CTA.buttonLabel}
      </Button>
    );
  }

  return <NewsletterDialog className={className} />;
}
