"use client";

import { ClientIcon } from "@/components/ui/client-icon";
import { InfoHoverCard } from "@/components/ui/InfoHoverCard";

type CheckoutBenefitRowProps = {
  icon: string;
  label: string;
  description: string;
};

export function CheckoutBenefitRow({
  icon,
  label,
  description,
}: CheckoutBenefitRowProps) {
  return (
    <li className="flex items-center gap-2">
      <ClientIcon
        src={icon}
        size={16}
        className="shrink-0 text-feedback-success"
      />
      <InfoHoverCard label={label}>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </InfoHoverCard>
    </li>
  );
}
