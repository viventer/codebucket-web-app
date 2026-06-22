"use client";

import Image from "next/image";

import { getCourseAssetUrl } from "@/lib/course-assets";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";

type StageImageDiagramProps = {
  courseId: string;
  imageSrc: string;
  className?: string;
};

export function StageImageDiagram({
  courseId,
  imageSrc,
  className,
}: StageImageDiagramProps) {
  const src = getCourseAssetUrl(courseId, imageSrc);

  return (
    <Image
      src={src}
      alt=""
      width={640}
      height={360}
      className="h-fit max-h-64 w-fit max-w-xl object-contain"
      unoptimized
    />
  );
}
