import { getPresaleRiskFreeBenefit } from "@/lib/course/landing-data";
import { formatPrice } from "@/lib/format-price";

export type PresaleBenefit = {
  icon: string;
  title: string;
  shortLabel: string;
  description: string;
};

/** Landing card order: risk-free, savings, lifetime. Checkout reorders to risk-free, lifetime, savings. */
export function buildPresaleBenefits(args: {
  refundDays: number;
  currentPrice?: number;
  standardPrice?: number;
}): PresaleBenefit[] {
  const { refundDays, currentPrice, standardPrice } = args;

  const savings =
    currentPrice !== undefined && standardPrice !== undefined
      ? Math.round(standardPrice - currentPrice)
      : null;

  const riskFreeBenefit = getPresaleRiskFreeBenefit(refundDays);

  return [
    {
      icon: "shield-check.svg",
      title: riskFreeBenefit.title,
      shortLabel: `${refundDays}-dniowa gwarancja satysfakcji`,
      description: riskFreeBenefit.description,
    },
    {
      icon: "price-tag.svg",
      title: savings !== null ? `Oszczędzasz ${savings} zł` : "Niższa cena",
      shortLabel:
        savings !== null ? `Oszczędzasz ${savings} zł` : "Niższa cena",
      description:
        currentPrice !== undefined && standardPrice !== undefined
          ? `W przedsprzedaży kurs kosztuje tylko ${formatPrice(currentPrice)}. Po premierze cena wzrośnie do ${formatPrice(standardPrice)}.`
          : "W przedsprzedaży kupujesz kurs w niższej cenie niż po premierze.",
    },
    {
      icon: "lock-unlocked.svg",
      title: "Dożywotni dostęp",
      shortLabel: "Dożywotni dostęp",
      description:
        "Otrzymujesz bezterminowy dostęp do pełnej wersji kursu i wszystkich aktualizacji.",
    },
  ];
}

/** Checkout mockup order: guarantee, lifetime access, savings. */
export function toCheckoutBenefitOrder(
  benefits: PresaleBenefit[],
): PresaleBenefit[] {
  const [riskFree, savings, lifetime] = benefits;
  if (!riskFree || !savings || !lifetime) {
    return benefits;
  }
  return [riskFree, lifetime, savings];
}
