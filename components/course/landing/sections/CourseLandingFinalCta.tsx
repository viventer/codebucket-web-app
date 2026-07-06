import Link from "next/link";
import { RocketIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CourseLandingData } from "@/lib/course/landing-data";

type CourseLandingFinalCtaProps = Pick<
  CourseLandingData,
  "ctaDescription" | "startHref" | "finalCtaButtonLabel"
>;

export function CourseLandingFinalCta({
  ctaDescription,
  startHref,
  finalCtaButtonLabel,
}: CourseLandingFinalCtaProps) {
  return (
    <Card className="ring-accent">
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-medium">Gotowy rozpocząć naukę?</h2>
          <p className="text-sm text-muted-foreground">{ctaDescription}</p>
        </div>

        <Button asChild size="lg" className="w-full max-w-md">
          <Link href={startHref}>
            <RocketIcon />
            {finalCtaButtonLabel}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
