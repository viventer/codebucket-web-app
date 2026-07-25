import Image from "next/image";
import Link from "next/link";

export function BrandLogo() {
  return (
    <Link href="/" className="mb-6 flex items-center justify-center gap-2">
      <Image src="/logo.svg" alt="CodeBucket" width={32} height={32} />
      <p className="text-lg font-medium tracking-tight">
        Code<span className="text-accent">Bucket</span>
      </p>
    </Link>
  );
}
