import {
  CodeIcon,
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
  codeExercise: CodeIcon,
  interactiveExercise: MousePointerClickIcon,
  customExercise: PuzzleIcon,
  interactiveDemo: MonitorPlayIcon,
  guidedProject: FolderGitIcon,
  individualProject: UserIcon,
};
