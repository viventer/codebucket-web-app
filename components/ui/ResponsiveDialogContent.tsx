"use client";

import * as React from "react";

import { DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** Mobile (<sm): full-page. Desktop: default centered dialog; override via className. */
const FULLPAGE_CLASSES =
  "flex flex-col max-sm:inset-0 max-sm:top-0 max-sm:left-0 max-sm:h-dvh max-sm:max-h-dvh max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:gap-4 max-sm:overflow-hidden max-sm:rounded-none max-sm:p-4";

export function ResponsiveDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent className={cn(FULLPAGE_CLASSES, className)} {...props}>
      {children}
    </DialogContent>
  );
}
