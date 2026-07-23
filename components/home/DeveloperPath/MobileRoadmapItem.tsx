import Image from "next/image";
import Link from "next/link";

import type { RoadmapItem } from "@/lib/roadmap/roadmap-content";
import { cn } from "@/lib/utils";

type MobileRoadmapItemProps = {
  item: RoadmapItem;
  isLast: boolean;
};

export function MobileRoadmapItem({ item, isLast }: MobileRoadmapItemProps) {
  const body = (
    <div className={cn("flex flex-col gap-1", isLast ? "pb-1" : "pb-6")}>
      <div className="flex items-center gap-2">
        <Image
          src={item.logo}
          alt=""
          width={22}
          height={22}
          className="size-5.5 shrink-0"
        />
        <p className="font-medium leading-none">{item.title}</p>
      </div>
      <p className="text-sm text-muted-foreground">{item.description}</p>
    </div>
  );

  return (
    <div className="grid h-full grid-cols-[1.25rem_1fr] gap-x-3">
      <div className="relative flex flex-col items-center self-stretch">
        {!isLast ? (
          <>
            <span className="relative z-10 mt-0.5 size-3 shrink-0 rounded-full bg-foreground" />
            <span
              className="absolute top-1.5 -bottom-px w-px bg-border"
              aria-hidden
            />
          </>
        ) : (
          <div
            className="flex h-full min-h-16 w-full flex-col items-center"
            aria-hidden
          >
            <span className="w-0 flex-1 border-l border-dashed border-foreground/55" />
            <span className="size-0 shrink-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-foreground" />
          </div>
        )}
      </div>

      {item.href ? (
        <Link href={item.href} className="min-w-0">
          {body}
        </Link>
      ) : (
        <div className="min-w-0">{body}</div>
      )}
    </div>
  );
}
