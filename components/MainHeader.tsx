import Image from "next/image";
import Link from "next/link";

import { HeaderAuth } from "@/components/HeaderAuth";

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background px-3">
      <div className="mx-auto flex h-14 w-[90vw] max-w-[1280px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="CodeBucket"
            width={28}
            height={28}
            priority
          />
          <p className="text-lg font-bold hidden sm:block tracking-tight">
            Code<span className="text-accent">Bucket</span>
          </p>
        </Link>

        <HeaderAuth />
      </div>
    </header>
  );
}
