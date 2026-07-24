"use client";

import { useSearchParams } from "next/navigation";
import { CardTitle } from "@/components/ui/card";

export function SignupHeading() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const isPurchase =
    searchParams.get("reason") === "purchase" || next.startsWith("/checkout/");

  const suffix = isPurchase
    ? "aby dokończyć zakup"
    : next
      ? "aby zapisać postęp i przejść do kolejnej sekcji"
      : null;

  return (
    <CardTitle className="text-center text-2xl font-bold">
      Utwórz darmowe konto
      {suffix && <span className="block text-lg font-normal ">{suffix}</span>}
    </CardTitle>
  );
}
