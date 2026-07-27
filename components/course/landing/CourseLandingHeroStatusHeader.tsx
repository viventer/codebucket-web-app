"use client";

import { ClientIcon } from "@/components/ui/client-icon";
import type { CourseLandingUserState } from "@/lib/course/landing-user-state";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";

type CourseLandingHeroStatusHeaderProps = {
  state: CourseLandingUserState;
  isFree: boolean;
  isPresale: boolean;
  currentPrice?: number;
  standardPrice?: number;
};

type StatusHeaderContent = {
  icon: string;
  iconClassName: string;
  title: string;
  subtitle: string;
};

function resolveStatusHeaderContent({
  state,
  isFree,
  isPresale,
  currentPrice,
  standardPrice,
}: CourseLandingHeroStatusHeaderProps): StatusHeaderContent | null {
  if (state.status === "completed") {
    return {
      icon: "trophy.svg",
      iconClassName: "text-accent",
      title: state.label,
      subtitle: state.subtitle,
    };
  }

  if (state.status === "in-progress") {
    return {
      icon: "trend-up.svg",
      iconClassName: "text-feedback-success",
      title: state.label,
      subtitle: state.subtitle,
    };
  }

  if (state.status === "owned-presale") {
    return {
      icon: "lock-unlocked.svg",
      iconClassName: "text-feedback-success",
      title: state.label,
      subtitle: state.subtitle,
    };
  }

  // status === "none"
  if (isPresale) {
    if (currentPrice === undefined) return null;

    return {
      icon: "price-tag.svg",
      iconClassName: "text-feedback-success",
      title: formatPrice(currentPrice),
      subtitle:
        standardPrice !== undefined
          ? `Cena regularna po premierze: ${formatPrice(standardPrice)}`
          : "",
    };
  }

  if (isFree) {
    return {
      icon: "price-tag.svg",
      iconClassName: "text-feedback-success",
      title: "Za darmo",
      subtitle: "Bezpłatny dostęp na zawsze",
    };
  }

  return null;
}

/**
 * Two-line status header (icon + big text / small text).
 * Line heights stay consistent across all five landing states so there is no layout shift.
 */
export function CourseLandingHeroStatusHeader(
  props: CourseLandingHeroStatusHeaderProps,
) {
  const content = resolveStatusHeaderContent(props);
  if (!content) return null;

  return (
    <div className="flex flex-col gap-0.5">
      <p className="flex items-center gap-2 text-lg font-bold">
        <ClientIcon
          src={content.icon}
          size={20}
          className={cn("shrink-0", content.iconClassName)}
        />
        {content.title}
      </p>
      {content.subtitle ? (
        <p className="text-sm text-muted-foreground">{content.subtitle}</p>
      ) : null}
    </div>
  );
}
