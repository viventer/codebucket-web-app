import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CtaCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

export function CtaCard({
  title,
  description,
  children,
  className,
}: CtaCardProps) {
  return (
    <Card className={cn("ring-accent bg-accent/5", className)}>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-medium">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
