"use client";

import * as React from "react";
import { useEffect, useState } from "react";

import { getIconName, prepareSvg } from "@/lib/icons/prepare-svg";
import { cn } from "@/lib/utils";

const fetchedSvgCache = new Map<string, string>();

export async function prefetchClientIcon(src: string): Promise<void> {
  await fetchRawSvg(getIconName(src));
}

async function fetchRawSvg(name: string): Promise<string> {
  const cached = fetchedSvgCache.get(name);
  if (cached) return cached;

  const response = await fetch(`/icons/${name}.svg`);
  if (!response.ok) {
    throw new Error(`Failed to load icon: ${name}`);
  }
  const svg = await response.text();
  fetchedSvgCache.set(name, svg);
  return svg;
}

export type ClientIconProps = Omit<React.ComponentProps<"span">, "children"> & {
  src: string;
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  label?: string;
};

export function ClientIcon({
  src,
  size = 24,
  width,
  height,
  color,
  className,
  style,
  label,
  ...props
}: ClientIconProps) {
  const iconName = getIconName(src);
  const w = width ?? size;
  const h = height ?? size;
  const [svgHtml, setSvgHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchRawSvg(iconName)
      .then((raw) => {
        if (!cancelled) {
          setSvgHtml(prepareSvg(raw, { width: w, height: h }));
        }
      })
      .catch(() => {
        if (!cancelled) setSvgHtml(null);
      });

    return () => {
      cancelled = true;
    };
  }, [iconName, w, h]);

  if (!svgHtml) {
    return (
      <span
        className={cn("inline-block shrink-0", className)}
        style={{ width: w, height: h, ...style }}
        aria-hidden={label ? undefined : true}
        {...props}
      />
    );
  }

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "inline-block shrink-0 [&>svg]:block [&>svg]:size-full",
        className,
      )}
      style={{ color, width: w, height: h, ...style }}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
      {...props}
    />
  );
}
