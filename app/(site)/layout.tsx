import { MainHeader } from "@/components/MainHeader";
import { SiteFooter } from "@/components/SiteFooter";

type SiteLayoutProps = {
  children: React.ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <MainHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
