import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <Image src="/logo.svg" alt="CodeBucket" width={32} height={32} />
          <p className="text-lg font-medium tracking-tight">
            Code<span className="text-accent">Bucket</span>
          </p>
        </Link>
        <Card>{children}</Card>
      </div>
    </div>
  );
}
