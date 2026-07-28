import { BrandLogo } from "@/components/BrandLogo";
import { NotFoundPageView } from "@/components/NotFoundPageView";

export const metadata = {
  title: "Strona nie została znaleziona – CodeBucket",
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <BrandLogo />
        <NotFoundPageView />
      </div>
    </div>
  );
}
