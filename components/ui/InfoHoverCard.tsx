"use client";

import { InfoIcon } from "lucide-react";

import {
  AdaptiveTooltip,
  AdaptiveTooltipContent,
  AdaptiveTooltipTrigger,
} from "@/components/ui/AdaptiveTooltip";
import { cn } from "@/lib/utils";

type InfoHoverCardProps = {
  children: React.ReactNode;
  /** When set, label text + info icon form the trigger. Otherwise only the icon. */
  label?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  openDelay?: number;
  closeDelay?: number;
};

export function InfoHoverCard({
  children,
  label,
  className,
  contentClassName,
  openDelay = 200,
  closeDelay = 100,
}: InfoHoverCardProps) {
  return (
    <AdaptiveTooltip openDelay={openDelay} closeDelay={closeDelay}>
      <AdaptiveTooltipTrigger asChild>
        <button
          type="button"
          aria-label={label ? undefined : "Więcej informacji"}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            label
              ? "underline-offset-4 hover:underline"
              : "shrink-0 text-muted-foreground hover:text-foreground",
            className,
          )}
        >
          {label}
          <InfoIcon className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </AdaptiveTooltipTrigger>
      <AdaptiveTooltipContent
        className={cn("flex flex-col gap-1", contentClassName)}
      >
        {children}
      </AdaptiveTooltipContent>
    </AdaptiveTooltip>
  );
}
