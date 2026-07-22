import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function SectionHeading({
  className,
  children,
  ...props
}: ComponentProps<"header">) {
  return (
    <header className={cn("text-center", className)} {...props}>
      {children}
    </header>
  );
}

function SectionHeadingTitle({
  className,
  children,
  ...props
}: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "mb-1 text-center text-xl font-medium sm:text-2xl",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

function SectionHeadingDescription({
  className,
  children,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-center text-sm text-muted-foreground max-w-2xl mx-auto",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

SectionHeading.Title = SectionHeadingTitle;
SectionHeading.Description = SectionHeadingDescription;

export { SectionHeading };
