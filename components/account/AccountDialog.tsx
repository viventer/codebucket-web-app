"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { auth } from "@/firebase/init";
import { deleteSession } from "@/actions/auth/session";
import { updateNewsletter } from "@/actions/user/update-newsletter";
import { getMainHeaderAccount } from "@/lib/auth/main-header-account";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ResponsiveDialogContent } from "@/components/ui/ResponsiveDialogContent";
import { Separator } from "@/components/ui/separator";
import {
  UserIcon,
  LogOutIcon,
  KeyRoundIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { AccountCoursesSection } from "@/components/account/AccountCoursesSection";
import type { AccountCourse } from "@/components/account/AccountCoursesSection";
import { AccountNewsletterSection } from "@/components/account/AccountNewsletterSection";
import { AccountThemeSection } from "@/components/account/AccountThemeSection";

export type { AccountCourse };

type AccountData = {
  email: string;
  courses: AccountCourse[];
  currentCourseId?: string;
  canChangePassword: boolean;
  newsletter: boolean;
};

export type AccountDialogProps = {
  triggerLabel?: string;
  /** Show user icon instead of label on <sm (course header). */
  iconOnMobile?: boolean;
  /** Button variant for the dialog trigger. Defaults to ghost. */
  triggerVariant?: "ghost" | "secondary";
};

export function AccountDialog({
  triggerLabel = "Twoje konto",
  iconOnMobile = false,
  triggerVariant = "ghost",
}: AccountDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [isFetching, startFetchTransition] = useTransition();
  const [isSigningOut, startSignOutTransition] = useTransition();
  const [, startNewsletterTransition] = useTransition();

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen && !accountData) {
      startFetchTransition(async () => {
        const result = await getMainHeaderAccount();
        if (result.isAuthenticated && result.account) {
          setAccountData(result.account);
        }
      });
    }
  }

  function handleSignOut() {
    startSignOutTransition(async () => {
      await auth.signOut();
      await deleteSession();
    });
  }

  function handleNewsletterChange(checked: boolean) {
    if (!accountData) return;

    const previous = accountData.newsletter;
    setAccountData({ ...accountData, newsletter: checked });

    startNewsletterTransition(async () => {
      const result = await updateNewsletter(checked);
      if (!result.success) {
        setAccountData((current) =>
          current?.newsletter === checked
            ? { ...current, newsletter: previous }
            : current,
        );
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size="sm">
          {iconOnMobile ? (
            <>
              <p className="hidden sm:block">{triggerLabel}</p>
              <UserIcon className="size-4 sm:hidden" />
            </>
          ) : (
            <p>{triggerLabel}</p>
          )}
        </Button>
      </DialogTrigger>
      <ResponsiveDialogContent className="sm:max-w-md">
        <DialogHeader className="shrink-0 space-y-0 mb-8 sm:mb-0">
          <DialogTitle className="text-center text-lg sm:text-xl">
            {triggerLabel}
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isFetching || !accountData ? (
            <div className="flex items-center justify-center py-12">
              <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <section className="flex flex-col gap-1">
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">{accountData.email}</p>
              </section>

              <AccountCoursesSection
                courses={accountData.courses}
                onNavigate={() => setOpen(false)}
              />

              {accountData.canChangePassword && (
                <section>
                  <Button asChild variant="outline" className="">
                    <Link href="/change-password">
                      <KeyRoundIcon className="size-4" />
                      Zmień hasło
                    </Link>
                  </Button>
                </section>
              )}

              <AccountThemeSection />

              <AccountNewsletterSection
                checked={accountData.newsletter}
                onCheckedChange={handleNewsletterChange}
              />

              <Separator />

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Napotkałeś problemy?{" "}
                  <Link
                    href="/help"
                    className="font-medium text-foreground underline underline-offset-4"
                  >
                    Pomoc
                  </Link>
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="hover:text-feedback-destructive"
                >
                  <LogOutIcon className="size-4" />
                  {isSigningOut ? "Wylogowywanie..." : "Wyloguj się"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </ResponsiveDialogContent>
    </Dialog>
  );
}
