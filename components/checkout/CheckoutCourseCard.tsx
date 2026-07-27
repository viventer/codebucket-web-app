import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CheckoutCourseCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  className?: string;
};

export function CheckoutCourseCard({
  title,
  description,
  imageUrl,
  className,
}: CheckoutCourseCardProps) {
  return (
    <Card
      className={cn(
        "border-0 bg-transparent py-0 ring-0 lg:bg-card lg:py-(--card-spacing) lg:ring-1 lg:ring-accent/40 rounded-none lg:rounded-lg",
        className,
      )}
    >
      <CardContent className="px-0 lg:px-(--card-spacing) ">
        <div className="flex items-start gap-3">
          <Image
            src={imageUrl}
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0"
          />
          <div className="flex flex-col gap-0.5">
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
