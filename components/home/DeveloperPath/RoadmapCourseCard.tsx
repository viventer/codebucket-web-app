import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import type { RoadmapItem } from "@/lib/roadmap/roadmap-content";

type RoadmapCourseCardProps = {
  item: RoadmapItem;
};

export function RoadmapCourseCard({ item }: RoadmapCourseCardProps) {
  const content = (
    <Card className="h-full">
      <CardContent className="flex h-full items-center gap-3">
        <Image
          src={item.logo}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0"
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="font-medium leading-tight">{item.title}</p>
          <p className="text-sm text-muted-foreground leading-snug">
            {item.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
