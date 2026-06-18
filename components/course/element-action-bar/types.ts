import type { CourseElement } from "@/schemas/courseSchema";

export type ElementActionBarProps = {
  type: CourseElement["type"];
  title: string;
  prevHref: string | null;
  nextHref: string | null;
  hasMaterials: boolean;
};

export type ElementActionsProps = Pick<
  ElementActionBarProps,
  "type" | "prevHref" | "nextHref" | "hasMaterials"
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
