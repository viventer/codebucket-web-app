"use client";

import { useTransition } from "react";
import Link from "next/link";
import { auth } from "@/firebase/init";
import { deleteSession } from "@/actions/auth/session";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  PlusIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  LogOutIcon,
  KeyRoundIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AccountCourse = {
  id: string;
  title: string;
};

export type AccountDialogProps = {
  email: string;
  courses: AccountCourse[];
  currentCourseId?: string;
  canChangePassword?: boolean;
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

export function AccountDialog({
  email,
  courses,
  currentCourseId,
  canChangePassword = false,
  triggerLabel = "Twoje konto",
}: AccountDialogProps) {
  const { theme, setTheme } = useTheme();
  const [isSigningOut, startSignOutTransition] = useTransition();

  function handleSignOut() {
    startSignOutTransition(async () => {
      await auth.signOut();
      await deleteSession();
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <p className="hidden sm:block">{triggerLabel}</p>
          <UserIcon className="size-4 sm:hidden" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {triggerLabel}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-6">
          <section className="flex flex-col gap-1">
            <h3 className="text-sm font-medium">Email</h3>
            <p className="text-sm text-muted-foreground">{email}</p>
          </section>

          <Separator />

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">Motyw kolorów</h3>
            <div className="flex gap-2">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-colors",
                    theme === option.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                  )}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          {canChangePassword && (
            <>
              <Separator />

              <section>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/change-password">
                    <KeyRoundIcon className="size-4" />
                    Zmień hasło
                  </Link>
                </Button>
              </section>
            </>
          )}

          <Separator />

          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-medium">Twoje kursy</h3>

              {courses.length > 0 ? (
                <ul className="flex flex-col gap-4 mt-2">
                  {courses.map((course) => (
                    <li
                      key={course.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <p className="text-sm text-muted-foreground">
                        {course.title}
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/course/${course.id}`}>
                          {course.id === currentCourseId
                            ? "Przejdź do kursu"
                            : "Otwórz"}
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">
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
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOutIcon className="size-4" />
              {isSigningOut ? "Wylogowywanie..." : "Wyloguj się"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
