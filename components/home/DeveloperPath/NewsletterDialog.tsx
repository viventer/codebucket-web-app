"use client";

import { useState, useTransition } from "react";

import { subscribeNewsletter } from "@/actions/newsletter/subscribe-newsletter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ROADMAP_CTA } from "@/lib/roadmap/roadmap-content";
import { newsletterSubscribeInputSchema } from "@/schemas/newsletterSchema";

type NewsletterDialogProps = {
  className?: string;
};

export function NewsletterDialog({ className }: NewsletterDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = newsletterSubscribeInputSchema.safeParse({ email });
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Podaj prawidłowy adres email.",
      );
      return;
    }

    setError(undefined);

    startTransition(async () => {
      const result = await subscribeNewsletter(parsed.data);
      if (!result.success) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      setEmail("");
      setOpen(false);
      toast.success("Zapisano do newslettera.");
    });
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setEmail("");
      setError(undefined);
    }
    setOpen(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={className}>{ROADMAP_CTA.buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dołącz do newslettera</DialogTitle>
          <DialogDescription>
            Podaj adres email, aby otrzymywać informacje o nowych kursach i
            materiałach.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="newsletter-email">Email</Label>
            <Input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              placeholder="jan@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(undefined);
              }}
              disabled={isPending}
              aria-invalid={Boolean(error)}
            />
            {error ? (
              <p className="text-sm text-feedback-destructive">{error}</p>
            ) : null}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Zapisywanie..." : "Zapisz się"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
