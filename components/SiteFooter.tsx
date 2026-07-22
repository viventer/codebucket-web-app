import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/help", label: "Pomoc i kontakt" },
  { href: "/terms", label: "Regulamin" },
  { href: "/privacy", label: "Polityka prywatności" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-[90vw] max-w-7xl flex-col gap-4 py-3  sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm font-medium">
          Code<span className="text-accent">Bucket</span> Studio 2026
        </p>

        <nav
          aria-label="Informacje prawne"
          className="flex flex-col sm:flex-row gap-x-6 gap-y-2 text-sm"
        >
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="underline decoration-1 underline-offset-2 decoration-accent hover:no-underline"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
