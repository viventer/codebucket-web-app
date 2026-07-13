import Image from "next/image";
import Link from "next/link";

import {
  AccountDialog,
  type AccountCourse,
} from "@/components/course/AccountDialog";
import { Button } from "@/components/ui/button";

type MainHeaderProps = {
  isAuthenticated: boolean;
  account?: {
    email: string;
    courses: AccountCourse[];
    currentCourseId?: string;
    canChangePassword: boolean;
  };
};

export function MainHeader({ isAuthenticated, account }: MainHeaderProps) {
  return (
    <header className="border-b bg-background px-3">
      <div className="mx-auto flex h-14 w-[90vw] max-w-[1280px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="CodeBucket"
            width={28}
            height={28}
            priority
          />
          <p className="text-lg font-bold">
            Code<span className="text-accent">Bucket</span>
          </p>
        </Link>

        {isAuthenticated && account ? (
          <AccountDialog
            email={account.email}
            courses={account.courses}
            currentCourseId={account.currentCourseId}
            canChangePassword={account.canChangePassword}
          />
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="default" size="sm">
              <Link href="/register">Utwórz darmowe konto</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Zaloguj się</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
