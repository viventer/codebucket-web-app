import type { CourseElement } from "@/schemas/courseSchema";

export type ElementActionBarProps = {
  type: CourseElement["type"];
  title: string;
  sectionOrder: number;
  sectionTitle: string;
  hideInfoOnMobile?: boolean;
  prevHref: string | null;
  nextHref: string | null;
  continueHref?: string | null;
  hasMaterials: boolean;
  hasHint?: boolean;
};

export type ElementActionsProps = Pick<
  ElementActionBarProps,
  "type" | "prevHref" | "nextHref" | "continueHref" | "hasMaterials" | "hasHint"
>;

export type NavButtonProps = {
  href: string | null;
  children: React.ReactNode;
  variant?: "default" | "ghost" | "outline";
};

export type PlaceholderButtonProps = {
  children: React.ReactNode;
  variant?: "default" | "ghost" | "outline";
};
