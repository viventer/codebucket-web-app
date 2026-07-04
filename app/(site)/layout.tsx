import { MainHeader } from "@/components/MainHeader";
import { getMainHeaderAccount } from "@/lib/main-header-account";

type SiteLayoutProps = {
  children: React.ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  const { isAuthenticated, account } = getMainHeaderAccount();

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <MainHeader isAuthenticated={isAuthenticated} account={account} />
      {children}
    </div>
  );
}
