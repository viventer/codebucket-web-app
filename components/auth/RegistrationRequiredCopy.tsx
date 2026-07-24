"use client";

import { useSearchParams } from "next/navigation";
import { CardDescription, CardTitle } from "@/components/ui/card";

export function RegistrationRequiredCopy() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const next = searchParams.get("next") ?? "";
  const isPurchase = reason === "purchase" || next.startsWith("/checkout/");

  if (isPurchase) {
    return (
      <>
        <CardTitle className="text-2xl font-bold">
          Utwórz konto, aby dokonać zakupu
        </CardTitle>
        <CardDescription>
          Do tego konta przypisany zostanie Twój kurs.
        </CardDescription>
      </>
    );
  }

  return (
    <>
      <CardTitle className="text-2xl font-bold">Załóż darmowe konto</CardTitle>
      <CardDescription>
        Potrzebujesz konta, aby zapisać postęp i przejść do kolejnej sekcji.
      </CardDescription>
    </>
  );
}
