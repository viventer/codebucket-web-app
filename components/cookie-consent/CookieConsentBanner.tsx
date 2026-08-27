"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CookieConsentRow } from "@/components/cookie-consent/CookieConsentRow";
import {
  applyConsent,
  type ConsentCategories,
  OPEN_COOKIE_SETTINGS_EVENT,
  readConsentCookie,
  writeConsentCookie,
} from "@/lib/consent";

function subscribeNever() {
  return () => {};
}

function getClientTrue() {
  return true;
}

function getServerFalse() {
  return false;
}

export function CookieConsentBanner() {
  // Client-only so the banner is not in SSR HTML (avoids a cookie-read hydration mismatch).
  const isClient = useSyncExternalStore(
    subscribeNever,
    getClientTrue,
    getServerFalse,
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sessionDecision, setSessionDecision] =
    useState<ConsentCategories | null>(null);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const handleOpenSettings = () => {
      const current = readConsentCookie();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setSettingsOpen(true);
    };

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings);
    return () =>
      window.removeEventListener(
        OPEN_COOKIE_SETTINGS_EVENT,
        handleOpenSettings,
      );
  }, []);

  const persist = (categories: ConsentCategories) => {
    writeConsentCookie(categories);
    applyConsent(categories);
    setSessionDecision(categories);
    setSettingsOpen(false);
  };

  const stored = isClient ? readConsentCookie() : null;
  const hasDecision = sessionDecision !== null || stored !== null;
  const visible = isClient && (settingsOpen || !hasDecision);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Zgoda na pliki cookie"
      className="fixed inset-x-0 bottom-0 z-[200] flex justify-center px-3 pb-3 sm:px-4 sm:pb-4"
    >
      <Card className="w-full max-w-3xl gap-4 border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Cookie className="size-5 shrink-0 text-primary" />
            Szanujemy Twoją prywatność
          </CardTitle>
          <CardDescription>
            Używamy plików cookies niezbędnych do działania strony oraz – za
            Twoją zgodą – plików statystycznych (Google Analytics) i
            marketingowych (Google Ads).Szczegóły znajdziesz w{" "}
            <Link
              href="/privacy"
              className="underline decoration-1 underline-offset-2 decoration-accent hover:no-underline"
            >
              polityce prywatności
            </Link>
            .
          </CardDescription>
        </CardHeader>

        {settingsOpen ? (
          <CardContent className="space-y-3">
            <Separator />
            <CookieConsentRow
              id="consent-necessary"
              title="Niezbędne"
              description="Konieczne do działania serwisu (sesja, preferencje motywu). Zawsze aktywne."
              checked
              disabled
            />
            <CookieConsentRow
              id="consent-analytics"
              title="Statystyczne"
              description="Google Analytics – anonimowe statystyki korzystania ze strony."
              checked={analytics}
              onChange={setAnalytics}
            />
            <CookieConsentRow
              id="consent-marketing"
              title="Marketingowe"
              description="Google Ads – mierzenie skuteczności reklam i remarketing."
              checked={marketing}
              onChange={setMarketing}
            />
          </CardContent>
        ) : null}

        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          {settingsOpen ? (
            <Button
              className="w-full sm:order-3 sm:w-auto"
              onClick={() => persist({ analytics, marketing })}
            >
              Zapisz wybór
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full sm:order-1 sm:w-auto"
              onClick={() => setSettingsOpen(true)}
            >
              Ustawienia
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full sm:order-2 sm:w-auto"
            onClick={() => persist({ analytics: false, marketing: false })}
          >
            Odrzuć wszystkie
          </Button>
          <Button
            className="w-full sm:order-4 sm:w-auto"
            onClick={() => persist({ analytics: true, marketing: true })}
          >
            Akceptuj wszystkie
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
