"use client";

import { ShieldCheck } from "lucide-react";

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
      <ShieldCheck
        className="size-4 shrink-0 text-feedback-success"
        aria-hidden
      />
      <InfoHoverCard label={`${refundDays}-dniowa gwarancja satysfakcji`}>
        <p className="font-medium">{benefit.title}</p>
        <p className="text-sm text-muted-foreground">{benefit.description}</p>
      </InfoHoverCard>
    </p>
  );
}
