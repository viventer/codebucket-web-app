"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type ExpandableElementProps = {
  children: ReactNode;
  collapsedHeight: number;
  expandText: string;
  collapseText: string;
  className?: string;
  contentClassName?: string;
  buttonClassName?: string;
};

export function ExpandableElement({
  children,
  collapsedHeight,
  expandText,
  collapseText,
  className,
  contentClassName,
  buttonClassName,
}: ExpandableElementProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean | null>(null);
  const [animationEnabled, setAnimationEnabled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const syncOverflow = () => {
      setIsOverflowing(el.scrollHeight > collapsedHeight + 1);
    };

    syncOverflow();
    const frame = requestAnimationFrame(() => setAnimationEnabled(true));

    const observer = new ResizeObserver(syncOverflow);
    observer.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [collapsedHeight]);

  const showToggle = isOverflowing === true;
  // null (unmeasured) or overflowing+collapsed → clipped; otherwise natural height
  const height =
    isOverflowing !== false && !isExpanded ? collapsedHeight : "auto";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <motion.div
        initial={false}
        animate={{ height }}
        transition={{
          duration: animationEnabled && !prefersReducedMotion ? 0.45 : 0,
          ease: [0.32, 0.72, 0, 1],
        }}
        className={cn("relative overflow-hidden", contentClassName)}
      >
        <div ref={contentRef}>{children}</div>

        {!isExpanded && showToggle ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-b from-transparent via-background/60 to-background"
          />
        ) : null}
      </motion.div>

      {showToggle ? (
        <Button
          variant="ghost"
          size="sm"
          className={cn("w-full", buttonClassName)}
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-300",
              prefersReducedMotion && "transition-none",
              isExpanded && "rotate-180",
            )}
          />
          {isExpanded ? collapseText : expandText}
        </Button>
      ) : null}
    </div>
  );
}
