"use client";

import { useTransition, useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/firebase/init";
import { deleteSession } from "@/actions/auth/session";
import { updateNewsletter } from "@/actions/user/update-newsletter";
import { getMainHeaderAccount } from "@/lib/auth/main-header-account";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InfoHoverCard } from "@/components/ui/InfoHoverCard";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  PlusIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  LogOutIcon,
  KeyRoundIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AccountCourse = {
  id: string;
  title: string;
};

type AccountData = {
  email: string;
  courses: AccountCourse[];
  currentCourseId?: string;
  canChangePassword: boolean;
  newsletter: boolean;
};

export type AccountDialogProps = {
  triggerLabel?: string;
};

type ThemeOption = { value: string; label: string; icon: React.ReactNode };

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Jasny", icon: <SunIcon className="size-4" /> },
  { value: "dark", label: "Ciemny", icon: <MoonIcon className="size-4" /> },
  {
    value: "system",
    label: "Systemowy",
    icon: <MonitorIcon className="size-4" />,
  },
];

const DEFAULT_THEME = "dark";

export function AccountDialog({
  triggerLabel = "Twoje konto",
}: AccountDialogProps) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [isFetching, startFetchTransition] = useTransition();
  const [isSigningOut, startSignOutTransition] = useTransition();
  const [, startNewsletterTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const activeTheme = mounted ? (theme ?? DEFAULT_THEME) : DEFAULT_THEME;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <p className="hidden sm:block">{triggerLabel}</p>
          <UserIcon className="size-4 sm:hidden" />
        </Button>
      </DialogTrigger>
      <DialogContent className="inset-0 top-0 left-0 flex h-dvh max-h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-4 overflow-hidden rounded-none p-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-none sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:gap-8 sm:overflow-visible sm:rounded-xl sm:p-6">
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

              <section className="flex flex-col gap-1">
                <h3 className="font-medium">Motyw kolorów</h3>
                <div className="flex gap-3 flex-col sm:flex-row">
                  {THEME_OPTIONS.map((option) => (
                    <Button
                      onClick={() => setTheme(option.value)}
                      key={option.value}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "sm:flex-1 p-4 transition-colors",
                        activeTheme === option.value
                          ? "border-accent"
                          : "text-muted-foreground",
                      )}
                    >
                      <span className="flex items-center gap-1">
                        {option.icon}
                        {option.label}
                      </span>
                    </Button>
                  ))}
                </div>
              </section>

              <section className="flex flex-col gap-1">
                <h3 className="font-medium">Newsletter</h3>
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id="account-newsletter"
                    checked={accountData.newsletter}
                    onCheckedChange={(checked) =>
                      handleNewsletterChange(checked === true)
                    }
                  />
                  <div className="flex items-start  gap-1.5">
                    <Label
                      htmlFor="account-newsletter"
                      className="font-normal leading-snug"
                    >
                      Chcę być na bieżąco z nowymi materiałami.
                    </Label>
                    <InfoHoverCard>
                      <p className="text-sm text-muted-foreground">
                        Otrzymuj dodatkowe materiały, praktyczne wskazówki,
                        informacje o nowych kursach i filmach oraz
                        aktualizacjach platformy.
                      </p>
                    </InfoHoverCard>
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-medium">Twoje kursy</h3>

                  {accountData.courses.length > 0 ? (
                    <ul className="flex flex-col gap-4">
                      {accountData.courses.map((course) => (
                        <li
                          key={course.id}
                          className="flex items-center justify-between gap-4"
                        >
                          <p className="text-sm text-muted-foreground">
                            {course.title}
                          </p>
                          <Button asChild variant="outline" size="sm">
                            <Link
                              href={`/course/${course.id}`}
                              onClick={() => setOpen(false)}
                            >
                              {course.id === accountData.currentCourseId
                                ? "Przejdź do kursu"
                                : "Otwórz"}
                            </Link>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nie masz jeszcze żadnych kursów.
                    </p>
                  )}
                </div>

                <Button className="w-full">
                  <PlusIcon />
                  Odblokuj nowy kurs
                </Button>
              </section>

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
      </DialogContent>
    </Dialog>
  );
}
