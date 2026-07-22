import type {
  CourseDocument,
  CourseOutline,
} from "@/schemas/courseSchema";

export type CourseNavigationData = {
  course: CourseDocument;
  outline: CourseOutline;
};
