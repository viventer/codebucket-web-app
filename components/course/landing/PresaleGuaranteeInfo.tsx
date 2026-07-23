"use client";

import { ClientIcon } from "@/components/ui/client-icon";
import { InfoHoverCard } from "@/components/ui/InfoHoverCard";
import { getPresaleRiskFreeBenefit } from "@/lib/course/landing-data";
import { cn } from "@/lib/utils";

type PresaleGuaranteeInfoProps = {
  refundDays: number;
  className?: string;
};

export function PresaleGuaranteeInfo({
  refundDays,
  className,
}: PresaleGuaranteeInfoProps) {
  const benefit = getPresaleRiskFreeBenefit(refundDays);

  return (
    <p className={cn("flex items-center gap-1.5 text-sm", className)}>
      <ClientIcon
        src="shield-check.svg"
        size={16}
        className="text-feedback-success"
      />
      <InfoHoverCard label={`${refundDays}-dniowa gwarancja satysfakcji`}>
        <p className="font-medium">{benefit.title}</p>
        <p className="text-sm text-muted-foreground">{benefit.description}</p>
      </InfoHoverCard>
    </p>
  );
}
