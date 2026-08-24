"use client";

import Link from "next/link";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type CheckoutTermsAcceptanceProps = {
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
};

export function CheckoutTermsAcceptance({
  accepted,
  onAcceptedChange,
}: CheckoutTermsAcceptanceProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-1.5">
        <Checkbox
          id="checkout-terms"
          checked={accepted}
          onCheckedChange={(checked) => onAcceptedChange(checked === true)}
        />
        <p className="text-sm leading-snug">
          <Label htmlFor="checkout-terms" className="inline font-normal">
            Akceptuję{" "}
          </Label>
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4"
          >
            regulamin
          </Link>
          <Label htmlFor="checkout-terms" className="inline font-normal">
            {" "}
            oraz{" "}
          </Label>
          <Link
            href="/refund"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4"
          >
            zasady zwrotów
          </Link>
          <Label htmlFor="checkout-terms" className="inline font-normal">
            .
          </Label>
        </p>
      </div>
      {!accepted ? (
        <p className="text-sm text-destructive">
          Aby dokonać płatności, zaakceptuj nasz regulamin i zasady zwrotów.
        </p>
      ) : null}
    </div>
  );
}
