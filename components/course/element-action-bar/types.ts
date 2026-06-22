import type { CourseElement } from "@/schemas/courseSchema";

export type ElementActionBarProps = {
  type: CourseElement["type"];
  title: string;
  sectionOrder: number;
  sectionTitle: string;
  hideInfoOnMobile?: boolean;
  prevHref: string | null;
  nextHref: string | null;
  hasMaterials: boolean;
  hasHint?: boolean;
};

export type NavigationLinkDirection = "forward" | "back" | "neutral";

export type ElementActionsProps = Pick<
  ElementActionBarProps,
  "type" | "prevHref" | "nextHref" | "hasMaterials" | "hasHint"
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
