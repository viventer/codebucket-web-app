"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { EyeIcon, EyeOffIcon, InfoIcon } from "lucide-react";
import { logEvent } from "firebase/analytics";
import { analytics, auth } from "@/firebase/init";
import { createSession } from "@/actions/auth/session";
import { migrateAllGuestProgressFromStorage } from "@/lib/course/migrate-guest-progress";
import { getFirebaseErrorMessage } from "@/lib/firebase-errors";
import { signupSchema } from "@/lib/auth/password-validation";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { PasswordRulesList } from "@/components/auth/PasswordRulesList";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InfoHoverCard } from "@/components/ui/InfoHoverCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function getSafeNext(raw: string | null): string {
  if (!raw) return "/";
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
}

export function SignupForm() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [isPending, startTransition] = useTransition();

  function validate() {
    const result = signupSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return false;
    }
    setErrors({});
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    startTransition(async () => {
      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const idToken = await credential.user.getIdToken();

        const sessionResult = await createSession(idToken, newsletter);
        if (!sessionResult.success) {
          setErrors({ form: sessionResult.error });
          await credential.user.delete();
          return;
        }

        await migrateAllGuestProgressFromStorage();
        if (analytics) {
          logEvent(analytics, "sign_up", { method: "email" });
        }

        window.location.assign(getSafeNext(nextParam));
      } catch (err) {
        const code = (err as { code?: string }).code ?? "";
        setErrors({ form: getFirebaseErrorMessage(code) });
      }
    });
  }

  const loginHref = nextParam
    ? `/login?next=${encodeURIComponent(getSafeNext(nextParam))}`
    : "/login";

  return (
    <div className="flex flex-col gap-6">
      <OAuthButtons />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-sm text-muted-foreground">lub przez email</span>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "signup-email-error" : undefined}
          />
          {errors.email && (
            <p
              id="signup-email-error"
              className="text-sm text-feedback-destructive"
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-password">Hasło</Label>
          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              disabled={isPending}
              aria-invalid={!!errors.password}
              aria-describedby={passwordFocused ? "password-rules" : undefined}
              className="pr-9"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isPending}
              aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>
          {passwordFocused && (
            <div id="password-rules">
              <PasswordRulesList password={password} touched />
            </div>
          )}
          {errors.password && (
            <p className="text-sm text-feedback-destructive" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Checkbox
            id="signup-newsletter"
            checked={newsletter}
            onCheckedChange={(checked) => setNewsletter(checked === true)}
            disabled={isPending}
          />
          <div className="flex items-start gap-1.5">
            <Label
              htmlFor="signup-newsletter"
              className="font-normal leading-snug"
            >
              Chcę być na bieżąco z nowymi materiałami.
            </Label>
            <InfoHoverCard>
              <p className="text-sm text-muted-foreground">
                Otrzymuj na swój email dodatkowe materiały, informacje o nowych
                kursach i filmach oraz aktualizacjach platformy.
              </p>
            </InfoHoverCard>
          </div>
        </div>

        {errors.form && (
          <p className="text-sm text-feedback-destructive" role="alert">
            {errors.form}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Tworzenie konta..." : "Utwórz konto"}
          </Button>
          {nextParam && (
            <div className="flex items-center gap-1.5">
              <InfoIcon className="size-4 shrink-0 text-muted-foreground" />
              <p className="text-sm text-muted-foreground leading-tight">
                Konto jest wymagane, aby zapisać zakupione kursy i postępy w
                nauce.
              </p>
            </div>
          )}
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Masz już konto?{" "}
        <Link
          href={loginHref}
          className="font-medium text-foreground underline underline-offset-4"
        >
          Zaloguj się
        </Link>
      </p>
    </div>
  );
}
