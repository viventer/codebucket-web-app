"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function RegistrationRequiredButtons() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("next") ?? "";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "";

  const signupHref = next
    ? `/signup?next=${encodeURIComponent(next)}`
    : "/signup";
  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : "/login";

  return (
    <div className="flex flex-col gap-3">
      <Button asChild className="w-full">
        <Link href={signupHref}>Zarejestruj się</Link>
      </Button>
      <Link
        href={loginHref}
        className="text-muted-foreground text-sm underline underline-offset-4"
      >
        Mam już konto – logowanie
      </Link>
    </div>
  );
}
