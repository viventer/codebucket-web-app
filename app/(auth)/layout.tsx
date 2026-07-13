import Link from "next/link";
import Image from "next/image";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <Image src="/logo.svg" alt="CodeBucket" width={32} height={32} />
          <span className="text-lg font-semibold">CodeBucket</span>
        </Link>
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
