const TAG_CLASS = "text-accent";
const DOCTYPE_CLASS = "text-muted-foreground";

function highlightHtmlLine(text: string) {
  if (text.startsWith("<!DOCTYPE")) {
    return <span className={DOCTYPE_CLASS}>{text}</span>;
  }

  const elementMatch = text.match(
    /^(<[a-zA-Z][\w-]*>)(.*?)(<\/[a-zA-Z][\w-]*>)$/,
  );
  if (elementMatch) {
    const [, openTag, innerText, closeTag] = elementMatch;
    return (
      <>
        <span className={TAG_CLASS}>{openTag}</span>
        {innerText ? (
          <span className="text-foreground">{innerText}</span>
        ) : null}
        {closeTag ? <span className={TAG_CLASS}>{closeTag}</span> : null}
      </>
    );
  }

  if (text.startsWith("<")) {
    return <span className={TAG_CLASS}>{text}</span>;
  }

  return <span className="text-foreground">{text}</span>;
}

type HighlightedCodeProps = {
  text: string;
};

export function HighlightedCode({ text }: HighlightedCodeProps) {
  return <span>{highlightHtmlLine(text)}</span>;
}
