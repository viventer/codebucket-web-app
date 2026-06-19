import type { editor } from "monaco-editor";

import type { SyntaxThemeColors } from "./theme-colors";

export function buildThemeData(
  colors: SyntaxThemeColors,
  base: "vs-dark" | "vs",
): editor.IStandaloneThemeData {
  return {
    base,
    inherit: true,
    rules: [
      { token: "tag", foreground: colors.cyan },
      { token: "delimiter", foreground: colors.cyan },
      { token: "metatag", foreground: colors.cyan },
      { token: "metatag.content", foreground: colors.cyan },
      { token: "attribute.name", foreground: colors.purple },
      { token: "keyword", foreground: colors.purple },
      { token: "attribute.value", foreground: colors.salmon },
      { token: "string", foreground: colors.salmon },
      { token: "comment", foreground: colors.green },
      { token: "comment.content", foreground: colors.green },
    ],
    colors: {
      "editor.foreground": `#${colors.foreground}`,
    },
  };
}
