function appendStyledText(
  output: HTMLElement,
  styleChain: HTMLElement[],
  text: string,
): void {
  if (text.length === 0) return;

  if (styleChain.length === 0) {
    output.appendChild(document.createTextNode(text));
    return;
  }

  let parent: HTMLElement = output;
  for (const element of styleChain) {
    const clone = document.createElement(element.tagName);
    const style = element.getAttribute("style");
    const className = element.getAttribute("class");

    if (style) clone.setAttribute("style", style);
    if (className) clone.setAttribute("class", className);

    parent.appendChild(clone);
    parent = clone;
  }

  parent.appendChild(document.createTextNode(text));
}

export function sliceColorizedHtml(
  colorizedHtml: string,
  plainStart: number,
  plainEnd: number,
): string {
  if (plainStart >= plainEnd) return "";

  const container = document.createElement("div");
  container.innerHTML = colorizedHtml;

  const output = document.createElement("span");
  let offset = 0;

  function walk(node: Node, styleChain: HTMLElement[]): boolean {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      const nodeStart = offset;
      const nodeEnd = offset + text.length;
      const overlapStart = Math.max(plainStart, nodeStart);
      const overlapEnd = Math.min(plainEnd, nodeEnd);

      if (overlapStart < overlapEnd) {
        appendStyledText(
          output,
          styleChain,
          text.slice(overlapStart - nodeStart, overlapEnd - nodeStart),
        );
      }

      offset = nodeEnd;
      return offset >= plainEnd;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;

      for (const child of node.childNodes) {
        if (walk(child, [...styleChain, element])) {
          return true;
        }
      }
    }

    return false;
  }

  for (const child of container.childNodes) {
    if (walk(child, [])) break;
  }

  return output.innerHTML;
}
