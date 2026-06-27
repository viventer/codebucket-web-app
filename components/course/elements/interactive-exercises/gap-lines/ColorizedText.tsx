type ColorizedTextProps = {
  html: string | null;
  fallback: string;
};

export function ColorizedText({ html, fallback }: ColorizedTextProps) {
  if (html) {
    return (
      <span
        className="inline leading-normal"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span className="inline text-foreground leading-normal">{fallback}</span>
  );
}
