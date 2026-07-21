import type { CourseElement } from "@/schemas/courseSchema";

export const ELEMENT_TYPE_ICONS: Record<CourseElement["type"], string> = {
  video: "clapperboard.svg",
  platformCodeExercise: "code.svg",
  localCodeExercise: "code-file.svg",
  interactiveExercise: "gamepad.svg",
  customExercise: "gamepad.svg",
  interactiveDemo: "cursor.svg",
  guidedProject: "ruler-cross-pen.svg",
  individualProject: "keyboard.svg",
  cheatsheet: "file-text.svg",
  courseEnding: "trophy.svg",
};
