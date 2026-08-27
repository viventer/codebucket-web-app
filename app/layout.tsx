import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookieConsentBanner } from "@/components/cookie-consent/CookieConsentBanner";
import { cn } from "@/lib/utils";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
});

const ubuntuMono = Ubuntu_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CodeBucket",
  description: "Najskuteczniejsza platforma do nauki programowania",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      suppressHydrationWarning
      className={cn(
        "h-full scrollbar scrollbar-thumb-primary scrollbar-track-card scroll-smooth",
        "antialiased",
        "font-sans",
        ubuntu.variable,
        ubuntuMono.variable,
      )}
    >
      <head>
        <Script id="consent-default" strategy="beforeInteractive">
          {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  personalization_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
try {
  var consentMatch = document.cookie.split('; ').find(function(row){
    return row.indexOf('cb_cookie_consent=') === 0;
  });
  if (consentMatch) {
    var stored = JSON.parse(decodeURIComponent(consentMatch.substring('cb_cookie_consent='.length)));
    if (stored && stored.version === 1) {
      var marketing = stored.marketing ? 'granted' : 'denied';
      gtag('consent', 'update', {
        analytics_storage: stored.analytics ? 'granted' : 'denied',
        ad_storage: marketing,
        ad_user_data: marketing,
        ad_personalization: marketing,
        personalization_storage: marketing
      });
    }
  }
} catch (e) {}
          `.trim()}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
          <Toaster />
          <CookieConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
