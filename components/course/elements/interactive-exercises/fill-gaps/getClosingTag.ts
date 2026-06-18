export function getClosingTag(openingTag: string): string {
  const match = openingTag.match(/^<([a-zA-Z][\w-]*)>$/);
  if (!match) return openingTag;
  return `</${match[1]}>`;
}
