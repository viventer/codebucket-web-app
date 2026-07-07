"use client";

import Link from "next/link";
import { RocketIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type CourseLandingFloatingCtaProps = {
  startHref: string | null;
  label: string;
  className?: string;
};

export function CourseLandingFloatingCta({
  startHref,
  label,
  className,
}: CourseLandingFloatingCtaProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [heroCtaVisible, setHeroCtaVisible] = useState(true);
  const [finalCtaVisible, setFinalCtaVisible] = useState(false);

  const showFloatingCta =
    Boolean(startHref) && !heroCtaVisible && !finalCtaVisible;

  useEffect(() => {
    const heroCta = document.querySelector("[data-course-landing-hero-cta]");
    const finalCta = document.querySelector("[data-course-landing-final-cta]");

    if (!heroCta || !finalCta) {
      return;
    }

    const heroCtaObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setHeroCtaVisible(entry.isIntersecting);
        }
      },
      { threshold: 0 },
    );

    const finalCtaObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setFinalCtaVisible(entry.isIntersecting);
        }
      },
      { threshold: 0 },
    );

    heroCtaObserver.observe(heroCta);
    finalCtaObserver.observe(finalCta);

    return () => {
      heroCtaObserver.disconnect();
      finalCtaObserver.disconnect();
    };
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-4",
        !showFloatingCta && "pointer-events-none",
        className,
      )}
      aria-hidden={!showFloatingCta}
    >
      <motion.div
        initial={false}
        animate={{
          opacity: showFloatingCta ? 1 : 0,
          y: prefersReducedMotion ? 0 : showFloatingCta ? 0 : 16,
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.25,
          ease: "easeOut",
        }}
        className="mx-auto flex w-[90vw] max-w-[1280px] items-center justify-center rounded-xl border border-accent bg-background/70 px-4! py-3 backdrop-blur"
      >
        <Button asChild size="lg" className="w-full max-w-md">
          <Link href={startHref!}>
            <RocketIcon />
            {label}
          </Link>
        </Button>
      </motion.div>
    </nav>
  );
}
