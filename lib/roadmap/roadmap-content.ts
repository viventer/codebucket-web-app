export type RoadmapItem = {
  logo: string;
  title: string;
  description: string;
  href?: string;
};

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    logo: "/courses/html-fundamentals/html-logo.svg",
    title: "Pełny kurs HTML",
    description: "Zacznij tworzyć swoje pierwsze strony.",
    href: "/course/html-fundamentals",
  },
  {
    logo: "/courses/css-basics/css-logo.svg",
    title: "Podstawy CSS",
    description: "Zacznij stylować swoje strony internetowe.",
    href: "/course/css-basics",
  },
  {
    logo: "/courses/js-basics/js-logo.svg",
    title: "Podstawy JavaScript",
    description: "Dodaj interaktywność do swoich stron.",
  },
  {
    logo: "/courses/advanced-js/advanced-js-logo.svg",
    title: "Zaawansowany JavaScript",
    description: "Wszystko co potrzebujesz wiedzieć przed nauką framework'ów.",
  },
  {
    logo: "/courses/react/react-logo.svg",
    title: "Pełny kurs React",
    description: "Twórz nowoczesne, interaktywne aplikacje webowe.",
  },
  {
    logo: "/courses/modern-css/modern-css-logo.svg",
    title: "Nowoczesny CSS",
    description:
      "Naucz się projektować i stylować nowoczesne strony internetowe.",
  },
];

export const ROADMAP_FINAL: RoadmapItem = {
  logo: "/icons/rocket.svg",
  title: "Twoja droga dopiero się zaczyna",
  description:
    "Ścieżka będzie rozwijana o kolejne, bardziej zaawansowane technologie.",
};

export const ROADMAP_HEADING = {
  title: "Ścieżka Frontend Developera",
  description:
    "Plan rozwoju platformy — kolejne kursy, które pomogą Ci przejść całą drogę frontend developera.",
} as const;

export const ROADMAP_CTA = {
  title: "Rozwijaj swoje umiejętności z CodeBucket",
  description:
    "Otrzymuj dodatkowe materiały, informacje o nowych kursach i filmach oraz aktualizacjach platformy.",
  buttonLabel: "Dołącz do newslettera",
} as const;
