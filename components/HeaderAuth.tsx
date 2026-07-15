"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const AccountDialog = dynamic(
  () =>
    import("@/components/course/AccountDialog").then((m) => ({
      default: m.AccountDialog,
    })),
  { ssr: false },
);

function readAuthCookie(): boolean {
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith("cb_auth="));
}

export function HeaderAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuthenticated(readAuthCookie());
  }, []);

  if (isAuthenticated === null) {
    // Fixed-size placeholder to prevent layout shift during hydration
    return <div className="h-8 w-48" aria-hidden />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">Zaloguj się</Link>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <Link href="/signup">Utwórz darmowe konto</Link>
        </Button>
      </div>
    );
  }

  return <AccountDialog />;
}
