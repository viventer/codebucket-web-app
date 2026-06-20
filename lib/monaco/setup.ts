import type { Language } from "@/schemas/courseSchema";

import { buildThemeData } from "./define-codebucket-theme";
import {
  getColorizeCacheKey,
  highlightCodeInline,
  inlineMonacoColorClasses,
  stripTrailingMonacoLineBreak,
} from "./colorize-html";
import {
  type CodeThemeMode,
  readSyntaxColorsFromDom,
  THEME_IDS,
} from "./theme-colors";

type MonacoModule = typeof import("monaco-editor");

let monacoPromise: Promise<MonacoModule> | null = null;
let appliedThemeMode: CodeThemeMode | null = null;

const colorizeCache = new Map<string, string>();

export function clearColorizeCache(): void {
  colorizeCache.clear();
}

export async function initMonaco(): Promise<MonacoModule> {
  if (!monacoPromise) {
    monacoPromise = import("monaco-editor");
  }

  return monacoPromise;
}

export async function applyCodebucketTheme(
  mode: CodeThemeMode,
): Promise<MonacoModule> {
  const monaco = await initMonaco();

  const colors = readSyntaxColorsFromDom();
  const themeId = THEME_IDS[mode];

  monaco.editor.defineTheme(
    themeId,
    buildThemeData(colors, mode === "dark" ? "vs-dark" : "vs"),
  );
  monaco.editor.setTheme(themeId);
  appliedThemeMode = mode;

  return monaco;
}

async function colorizeWithInlineFallback(
  text: string,
  language: Language,
): Promise<string> {
  const colors = readSyntaxColorsFromDom();
  const lines = text.split("\n");

  return lines
    .map((line) => highlightCodeInline(line, language, colors))
    .join("<br/>");
}

export async function colorizeCode(
  text: string,
  language: Language,
  mode: CodeThemeMode,
): Promise<string> {
  const key = getColorizeCacheKey(mode, language, text);
  const cached = colorizeCache.get(key);
  if (cached) return cached;

  if (appliedThemeMode !== mode) {
    clearColorizeCache();
  }

  const monaco = await applyCodebucketTheme(mode);

  let html = await monaco.editor.colorize(text, language, {});
  html = inlineMonacoColorClasses(html);

  if (!html.includes("style=")) {
    html = await colorizeWithInlineFallback(text, language);
  }

  html = stripTrailingMonacoLineBreak(html);

  colorizeCache.set(key, html);
  return html;
}

export { THEME_IDS };
