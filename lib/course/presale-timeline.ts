import type { CoursePresaleInfo } from "@/lib/course/landing-data";
import { formatPrice } from "@/lib/format-price";

export type PresaleTimelineStep = {
  icon: string;
  title: string;
  description: string;
  dateLabel: string | null;
  highlighted: boolean;
};

export function buildPresaleTimelineSteps(
  presale: CoursePresaleInfo,
  currentPrice?: number,
  standardPrice?: number,
): PresaleTimelineStep[] {
  return [
    {
      icon: "rocket.svg",
      title: "Start przedsprzedaży",
      description:
        currentPrice !== undefined
          ? `Kup kurs w niższej cenie ${formatPrice(currentPrice)}.`
          : "Kup kurs w niższej cenie.",
      dateLabel: presale.presaleStartDateLabel,
      highlighted: false,
    },
    {
      icon: "confetti.svg",
      title: "Premiera kursu",
      description:
        standardPrice !== undefined
          ? `Koniec przedsprzedaży. Cena wzrasta do ${formatPrice(standardPrice)}.`
          : "Koniec przedsprzedaży. Cena wzrasta.",
      dateLabel: presale.releaseDateLabel,
      highlighted: true,
    },
    {
      icon: "shield-check.svg",
      title: "Gwarancja satysfakcji",
      description: `${presale.refundDays} dni na zwrot środków, jeśli kurs Ci się nie spodoba.`,
      dateLabel: null,
      highlighted: false,
    },
  ];
}
