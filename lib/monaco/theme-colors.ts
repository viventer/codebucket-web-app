export type CodeThemeMode = "dark" | "light";

export type SyntaxThemeColors = {
  foreground: string;
  cyan: string;
  purple: string;
  salmon: string;
  green: string;
};

export const THEME_IDS: Record<CodeThemeMode, string> = {
  dark: "codebucket-dark",
  light: "codebucket-light",
};

const HEX_COLOR_PATTERN = /^[0-9a-fA-F]{6}$/;

function readCssVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function cssColorToHex(color: string): string {
  if (!color) return "d4d4d4";

  if (color.startsWith("#")) {
    const hex = color.slice(1);
    if (HEX_COLOR_PATTERN.test(hex)) return hex.toLowerCase();
  }

  if (HEX_COLOR_PATTERN.test(color)) return color.toLowerCase();

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return "d4d4d4";

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);

  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("");
}

function toMonacoHex(color: string, fallback: string): string {
  const hex = cssColorToHex(color);
  return HEX_COLOR_PATTERN.test(hex) ? hex : fallback;
}

export function readSyntaxColorsFromDom(): SyntaxThemeColors {
  return {
    foreground: toMonacoHex(readCssVar("--syntax-foreground"), "d4d4d4"),
    cyan: toMonacoHex(readCssVar("--syntax-cyan"), "70b0c2"),
    purple: toMonacoHex(readCssVar("--syntax-purple"), "ab70c2"),
    salmon: toMonacoHex(readCssVar("--syntax-salmon"), "c28270"),
    green: toMonacoHex(readCssVar("--syntax-green"), "87c270"),
  };
}

export function getCodeThemeMode(): CodeThemeMode {
  const root = document.documentElement;

  if (root.classList.contains("dark")) return "dark";
  if (root.classList.contains("light")) return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
