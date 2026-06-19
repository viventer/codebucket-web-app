import type { Language } from "@/schemas/courseSchema";

import type { CodeThemeMode } from "./theme-colors";

type SyntaxThemeColorKeys = {
  foreground: string;
  cyan: string;
  purple: string;
  salmon: string;
  green: string;
};

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function readMtkColorMap(): Map<string, string> {
  const map = new Map<string, string>();
  const sheet = document.querySelector("style.monaco-colors");

  if (!sheet?.textContent) return map;

  const rulePattern = /\.mtk(\d+)\s*\{\s*color:\s*([^;]+);/g;

  for (const match of sheet.textContent.matchAll(rulePattern)) {
    map.set(`mtk${match[1]}`, match[2]?.trim() ?? "");
  }

  return map;
}

export function inlineMonacoColorClasses(html: string): string {
  const mtkColors = readMtkColorMap();
  if (mtkColors.size === 0) return html;

  return html.replace(
    /<span class="([^"]*)">/g,
    (fullMatch, classNames: string) => {
      const mtkClass = classNames
        .split(/\s+/)
        .find((name) => /^mtk\d+$/.test(name));

      if (!mtkClass) return fullMatch;

      const color = mtkColors.get(mtkClass);
      if (!color) return fullMatch;

      return `<span style="color:${color}">`;
    },
  );
}

export function highlightHtmlInline(
  text: string,
  colors: SyntaxThemeColorKeys,
): string {
  if (text.startsWith("<!DOCTYPE")) {
    return `<span style="color:#${colors.cyan}">${escapeHtml(text)}</span>`;
  }

  const elementMatch = text.match(
    /^(<[a-zA-Z][\w-]*>)(.*?)(<\/[a-zA-Z][\w-]*>)$/,
  );

  if (elementMatch) {
    const [, openTag, innerText, closeTag] = elementMatch;
    return [
      `<span style="color:#${colors.cyan}">${escapeHtml(openTag ?? "")}</span>`,
      innerText
        ? `<span style="color:#${colors.foreground}">${escapeHtml(innerText)}</span>`
        : "",
      closeTag
        ? `<span style="color:#${colors.cyan}">${escapeHtml(closeTag)}</span>`
        : "",
    ].join("");
  }

  if (text.startsWith("<")) {
    return `<span style="color:#${colors.cyan}">${escapeHtml(text)}</span>`;
  }

  return `<span style="color:#${colors.foreground}">${escapeHtml(text)}</span>`;
}

export function highlightCodeInline(
  text: string,
  language: Language,
  colors: SyntaxThemeColorKeys,
): string {
  if (language === "html") {
    return highlightHtmlInline(text, colors);
  }

  return `<span style="color:#${colors.foreground}">${escapeHtml(text)}</span>`;
}

export function getColorizeCacheKey(
  mode: CodeThemeMode,
  language: Language,
  text: string,
): string {
  return `${mode}:${language}:${text}`;
}
