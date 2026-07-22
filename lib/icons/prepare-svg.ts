export function getIconName(src: string): string {
  return src.endsWith(".svg") ? src.slice(0, -4) : src;
}

export function prepareSvg(
  raw: string,
  { width, height }: { width: number; height: number },
): string {
  return raw
    .replace(/<g id="SVGRepo_bgCarrier"[^>]*\/>/g, "")
    .replace(/<g id="SVGRepo_tracerCarrier"[^>]*\/>/g, "")
    .replace(/<g id="SVGRepo_bgCarrier"[^>]*>[\s\S]*?<\/g>/g, "")
    .replace(/<g id="SVGRepo_tracerCarrier"[^>]*>[\s\S]*?<\/g>/g, "")
    .replace(/<g id="SVGRepo_iconCarrier">\s*([\s\S]*?)\s*<\/g>/, "$1")
    .replace(/fill="#[0-9A-Fa-f]{3,8}"/g, 'fill="currentColor"')
    .replace(/stroke="#[0-9A-Fa-f]{3,8}"/g, 'stroke="currentColor"')
    .replace(/<svg([^>]*)>/, (_, attrs: string) => {
      // `size-full` opts out of Button's `[&_svg:not([class*='size-'])]:size-*`
      // so the icon follows the wrapper size instead of staying at 16px.
      const cleanAttrs = attrs
        .replace(/\s(width|height)="[^"]*"/gi, "")
        .replace(/\sclass="[^"]*"/i, "");
      return `<svg${cleanAttrs} class="size-full" width="${width}" height="${height}">`;
    });
}
