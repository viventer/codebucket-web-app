"use client";

import { useEffect, useState } from "react";

import { getNewsletterStatus } from "@/actions/newsletter/newsletter-status";
import { CtaCard } from "@/components/CtaCard";
import { NewsletterCtaButton } from "@/components/home/DeveloperPath/NewsletterCtaButton";
import { isGuestUser } from "@/lib/course/guest-progress";
import { ROADMAP_CTA } from "@/lib/roadmap/roadmap-content";

type CtaState =
  | { status: "pending" }
  | { status: "hidden" }
  | { status: "ready"; isAuthenticated: boolean };

export function NewsletterCta() {
  const [state, setState] = useState<CtaState>({ status: "pending" });

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      if (isGuestUser()) {
        if (!cancelled) {
          setState({ status: "ready", isAuthenticated: false });
        }
        return;
      }

      const status = await getNewsletterStatus();
      if (cancelled) return;

      if (!status.isAuthenticated) {
        setState({ status: "ready", isAuthenticated: false });
        return;
      }

      if (status.subscribed) {
        setState({ status: "hidden" });
        return;
      }

      setState({ status: "ready", isAuthenticated: true });
    }

    void resolve();

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status !== "ready") {
    return null;
  }

  return (
    <CtaCard title={ROADMAP_CTA.title} description={ROADMAP_CTA.description}>
      <NewsletterCtaButton
        isAuthenticated={state.isAuthenticated}
        className="w-full max-w-md"
      />
    </CtaCard>
  );
}
