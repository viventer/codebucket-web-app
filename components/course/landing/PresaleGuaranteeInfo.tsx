"use client";

import { InfoIcon } from "lucide-react";

import { ClientIcon } from "@/components/ui/client-icon";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/HoverCard";
import { getPresaleRiskFreeBenefit } from "@/lib/course/landing-data";

type PresaleGuaranteeInfoProps = {
  refundDays: number;
};

export function PresaleGuaranteeInfo({
  refundDays,
}: PresaleGuaranteeInfoProps) {
  const benefit = getPresaleRiskFreeBenefit(refundDays);

  return (
    <p className="flex items-center gap-1.5 text-sm">
      <ClientIcon
        src="shield-check.svg"
        size={16}
        className="text-feedback-success"
      />
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-left underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {refundDays}-dniowa gwarancja satysfakcji
            <InfoIcon className="size-4 shrink-0 text-muted-foreground" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="flex flex-col gap-1">
          <p className="font-medium">{benefit.title}</p>
          <p className="text-sm text-muted-foreground">{benefit.description}</p>
        </HoverCardContent>
      </HoverCard>
    </p>
  );
}
