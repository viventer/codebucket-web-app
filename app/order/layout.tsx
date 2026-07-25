import { BrandLogo } from "@/components/BrandLogo";

type OrderLayoutProps = {
  children: React.ReactNode;
};

export default function OrderLayout({ children }: OrderLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <BrandLogo />
        {children}
      </div>
    </div>
  );
}
