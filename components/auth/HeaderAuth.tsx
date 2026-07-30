"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AccountButtons } from "../account/AccountButtons";
import { AuthButtons } from "./AuthButtons";
import { AuthPopover } from "./AuthPopover";

const AccountDialog = dynamic(
  () =>
    import("@/components/account/AccountDialog").then((m) => ({
      default: m.AccountDialog,
    })),
  { ssr: false },
);

function readAuthCookie(): boolean {
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith("cb_auth="));
}

type HeaderAuthProps = {
  /** On <sm show a user icon + popover instead of auth buttons (course header only). */
  mobilePopover?: boolean;
};

export function HeaderAuth({ mobilePopover = false }: HeaderAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuthenticated(readAuthCookie());
  }, []);

  if (isAuthenticated === null) {
    // Fixed-size placeholder to prevent layout shift during hydration
    return (
      <div
        className={mobilePopover ? "h-8 w-8 sm:w-48" : "h-8 w-56"}
        aria-hidden
      />
    );
  }

  if (!isAuthenticated) {
    if (mobilePopover) {
      return (
        <>
          <div className="hidden sm:block">
            <AuthButtons />
          </div>
          <AuthPopover />
        </>
      );
    }

    return <AuthButtons />;
  }

  if (mobilePopover) {
    return <AccountDialog iconOnMobile />;
  }

  return <AccountButtons />;
}
