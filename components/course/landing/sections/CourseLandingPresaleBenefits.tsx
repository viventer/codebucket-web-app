import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import {
  getPresaleRiskFreeBenefit,
  type CoursePresaleInfo,
} from "@/lib/course/landing-data";
import { formatPrice } from "@/lib/format-price";

type CourseLandingPresaleBenefitsProps = {
  presale: CoursePresaleInfo;
  currentPrice?: number;
  standardPrice?: number;
};

export function CourseLandingPresaleBenefits({
  presale,
  currentPrice,
  standardPrice,
}: CourseLandingPresaleBenefitsProps) {
  const savings =
    currentPrice !== undefined && standardPrice !== undefined
      ? Math.round(standardPrice - currentPrice)
      : null;

  const riskFreeBenefit = getPresaleRiskFreeBenefit(presale.refundDays);

  const benefits = [
    {
      icon: "shield-check.svg",
      title: riskFreeBenefit.title,
      description: riskFreeBenefit.description,
    },
    {
      icon: "price-tag.svg",
      title: savings !== null ? `Oszczędzasz ${savings} zł` : "Niższa cena",
      description:
        currentPrice !== undefined && standardPrice !== undefined
          ? `W przedsprzedaży kurs kosztuje tylko ${formatPrice(currentPrice)}. Po premierze cena wzrośnie do ${formatPrice(standardPrice)}.`
          : "W przedsprzedaży kupujesz kurs w niższej cenie niż po premierze.",
    },
    {
      icon: "lock-unlocked.svg",
      title: "Dożywotni dostęp",
      description:
        "Otrzymujesz bezterminowy dostęp do pełnej wersji kursu i wszystkich aktualizacji.",
    },
  ];

  return (
    <Card className="ring-primary bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Dlaczego warto skorzystać z przedsprzedaży?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
          {benefits.map((benefit) => (
            <li
              key={benefit.title}
              className="flex flex-col gap-2 sm:px-6 sm:first:pl-0 sm:last:pr-0"
            >
              <div className="flex items-center gap-2">
                <Icon src={benefit.icon} size={24} className="text-accent" />
                <p className="font-medium">{benefit.title}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
