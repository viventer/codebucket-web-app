import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";

type ContactThankYouLayoutProps = {
  children: React.ReactNode;
};

export default function ContactThankYouLayout({
  children,
}: ContactThankYouLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <BrandLogo />
          {children}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
