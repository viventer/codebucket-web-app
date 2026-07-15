import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as React from "react";

import { getIconName, prepareSvg } from "@/lib/icons/prepare-svg";
import { cn } from "@/lib/utils";

const rawSvgCache = new Map<string, string>();

function loadRawSvg(name: string): string {
  const cached = rawSvgCache.get(name);
  if (cached) return cached;

  const svg = readFileSync(
    join(process.cwd(), "public", "icons", `${name}.svg`),
    "utf-8",
  );
  rawSvgCache.set(name, svg);
  return svg;
}

export type IconProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** Icon file name from `public/icons` (with or without `.svg`). */
  src: string;
  /** Width and height in pixels. Defaults to 24. */
  size?: number;
  width?: number;
  height?: number;
  /** Icon color. Defaults to `currentColor` (inherits from text color). */
  color?: string;
  /** Accessible label. When omitted, the icon is treated as decorative. */
  label?: string;
};

export function Icon({
  src,
  size = 24,
  width,
  height,
  color,
  className,
  style,
  label,
  ...props
}: IconProps) {
  const iconName = getIconName(src);
  const w = width ?? size;
  const h = height ?? size;
  const svg = prepareSvg(loadRawSvg(iconName), { width: w, height: h });

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
      dangerouslySetInnerHTML={{ __html: svg }}
      {...props}
    />
  );
}
