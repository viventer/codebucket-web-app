import { BrandLogo } from "@/components/BrandLogo";

type CheckoutLayoutProps = {
  children: React.ReactNode;
};

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <div className="min-h-dvh bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <BrandLogo />
        {children}
      </div>
    </div>
  );
}
