import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function MainContainer({ className, children, ...props }: ComponentProps<"main">) {
  return (
    <main
      className={cn(
        "mx-auto flex w-[90vw] max-w-7xl flex-1 flex-col pt-8 pb-24 sm:pt-16 sm:pb-32",
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}

export { MainContainer };
