/** Folder names under `courses/` used only by the seed script. */
export const COURSE_SEED_REGISTRY: Record<string, { folder: string }> = {
  "html-fundamentals": { folder: "html fundamentals" },
};

export type PresaleCourseSeedData = {
  id: string;
  title: string;
  description: string;
  badge: string;
  badgeClassName: string;
  currentPrice: number;
  isPresale: true;
  whatYouWillLearn: string[];
};

/** Courses without course.json — metadata-only documents for presale cards. */
export const PRESALE_COURSE_SEED_DATA: PresaleCourseSeedData[] = [
  {
    id: "css-basics",
    title: "Podstawy CSS",
    description: "Naucz się stylować strony internetowe.",
    badge: "CSS",
    badgeClassName: "bg-sky-500 text-white",
    currentPrice: 59.99,
    isPresale: true,
    whatYouWillLearn: [
      "Selektory CSS i specyficzność",
      "Kolory i typografia",
      "CSS box-model",
      "Flexbox",
      "Responsywność",
      "CSS Grid",
    ],
  },
];
