"use client";

import * as React from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/HoverCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";

const AdaptiveTooltipContext = React.createContext(false);

type AdaptiveTooltipProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
};

function AdaptiveTooltip({
  children,
  open,
  defaultOpen,
  onOpenChange,
  openDelay = 200,
  closeDelay = 100,
}: AdaptiveTooltipProps) {
  const isMobile = useIsMobile();

  return (
    <AdaptiveTooltipContext.Provider value={isMobile}>
      {isMobile ? (
        <Popover
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
        >
          {children}
        </Popover>
      ) : (
        <HoverCard
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          openDelay={openDelay}
          closeDelay={closeDelay}
        >
          {children}
        </HoverCard>
      )}
    </AdaptiveTooltipContext.Provider>
  );
}

type AdaptiveTooltipTriggerProps = React.ComponentProps<
  typeof HoverCardTrigger
> &
  React.ComponentProps<typeof PopoverTrigger>;

function AdaptiveTooltipTrigger(props: AdaptiveTooltipTriggerProps) {
  const isMobile = React.useContext(AdaptiveTooltipContext);

  if (isMobile) {
    return <PopoverTrigger {...props} />;
  }

  return <HoverCardTrigger {...props} />;
}

type AdaptiveTooltipContentProps = React.ComponentProps<
  typeof HoverCardContent
> &
  React.ComponentProps<typeof PopoverContent>;

function AdaptiveTooltipContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: AdaptiveTooltipContentProps) {
  const isMobile = React.useContext(AdaptiveTooltipContext);

  if (isMobile) {
    return (
      <PopoverContent
        className={cn("w-64 gap-1 p-4", className)}
        align={align}
        sideOffset={sideOffset}
        {...props}
      />
    );
  }

  return (
    <HoverCardContent
      className={className}
      align={align}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

export { AdaptiveTooltip, AdaptiveTooltipTrigger, AdaptiveTooltipContent };
