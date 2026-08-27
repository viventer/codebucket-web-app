"use client";

import { cn } from "@/lib/utils";
import { OPEN_COOKIE_SETTINGS_EVENT } from "@/lib/consent";

export function CookieSettingsTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))
      }
      className={cn(
        "underline decoration-1 underline-offset-2 decoration-accent hover:no-underline text-left hover:cursor-pointer",
        className,
      )}
    >
      Ustawienia cookies
    </button>
  );
}
