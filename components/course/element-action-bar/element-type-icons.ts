import {
  CodeIcon,
  FileTextIcon,
  FileVideoIcon,
  FolderGitIcon,
  MonitorPlayIcon,
  MousePointerClickIcon,
  PuzzleIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react";

import type { CourseElement } from "@/schemas/courseSchema";

export const ELEMENT_TYPE_ICONS: Record<CourseElement["type"], LucideIcon> = {
  video: FileVideoIcon,
  platformCodeExercise: CodeIcon,
  localCodeExercise: CodeIcon,
  interactiveExercise: MousePointerClickIcon,
  customExercise: PuzzleIcon,
  interactiveDemo: MonitorPlayIcon,
  guidedProject: FolderGitIcon,
  individualProject: UserIcon,
  cheatsheet: FileTextIcon,
};
