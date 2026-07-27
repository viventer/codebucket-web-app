import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { CoursePresaleInfo } from "@/lib/course/landing-data";
import { buildPresaleBenefits } from "@/lib/course/presale-benefits";

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
  const benefits = buildPresaleBenefits({
    refundDays: presale.refundDays,
    currentPrice,
    standardPrice,
  });

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
