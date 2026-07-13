import { MainHeader } from "@/components/MainHeader";

type SiteLayoutProps = {
  children: React.ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <MainHeader />
      {children}
    </div>
  );
}
