import { BrandLogo } from "@/components/BrandLogo";
import { Card } from "@/components/ui/card";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <BrandLogo />
        <Card>{children}</Card>
      </div>
    </div>
  );
}
