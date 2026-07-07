import type {
  CourseDocument,
  CourseOutline,
} from "@/schemas/courseSchema";

export type CourseCardData = {
  id: string;
  title: string;
  description: string;
  badge: string;
  badgeClassName: string;
  currentPrice: number;
  whatYouWillLearn: string[];
  isPresale: boolean;
};

export type CourseNavigationData = {
  course: CourseDocument;
  outline: CourseOutline;
};
