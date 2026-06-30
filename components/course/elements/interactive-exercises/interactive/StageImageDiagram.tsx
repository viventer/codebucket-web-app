"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

type StageImageDiagramProps = {
  src: string;
  className?: string;
};

export function StageImageDiagram({ src, className }: StageImageDiagramProps) {
  return (
    <Image
      src={src}
      alt=""
      width={640}
      height={360}
      priority
      className={cn(
        "h-fit max-h-64 w-fit max-w-full object-contain sm:max-w-xl bg-black/30 p-4 rounded-lg shadow-md",
        className,
      )}
      unoptimized
    />
  );
}
