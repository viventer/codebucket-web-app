"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { InfoHoverCard } from "@/components/ui/InfoHoverCard";
import { Label } from "@/components/ui/label";

type AccountNewsletterSectionProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function AccountNewsletterSection({
  checked,
  onCheckedChange,
}: AccountNewsletterSectionProps) {
  return (
    <section className="flex flex-col gap-1">
      <h3 className="font-medium">Newsletter</h3>
      <div className="flex items-center gap-1.5">
        <Checkbox
          id="account-newsletter"
          checked={checked}
          onCheckedChange={(value) => onCheckedChange(value === true)}
        />
        <div className="flex items-start gap-1.5">
          <Label
            htmlFor="account-newsletter"
            className="font-normal leading-snug"
          >
            Chcę być na bieżąco z nowymi materiałami.
          </Label>
          <InfoHoverCard>
            <p className="text-sm text-muted-foreground">
              Otrzymuj dodatkowe materiały, informacje o nowych kursach i
              filmach oraz aktualizacjach platformy.
            </p>
          </InfoHoverCard>
        </div>
      </div>
    </section>
  );
}
