export function prepareHeroSvg(raw: string): string {
  return raw
    .replace(/fill="#66DFFF"/g, 'fill="var(--accent)"')
    .replace(/fill="#F5F5F5"/g, 'fill="var(--foreground)"');
}
