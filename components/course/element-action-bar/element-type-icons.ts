import {
  CodeIcon,
  FileVideoIcon,
  FolderGitIcon,
  ListChecksIcon,
  MonitorPlayIcon,
  MousePointerClickIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react";

import type { CourseElement } from "@/schemas/courseSchema";

export const ELEMENT_TYPE_ICONS: Record<CourseElement["type"], LucideIcon> = {
  video: FileVideoIcon,
  codeExercise: CodeIcon,
  interactiveExercise: MousePointerClickIcon,
  interactiveDemo: MonitorPlayIcon,
  quiz: ListChecksIcon,
  guidedProject: FolderGitIcon,
  individualProject: UserIcon,
};
