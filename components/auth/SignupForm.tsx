"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/init";
import { createSession } from "@/actions/auth/session";
import { migrateAllGuestProgressFromStorage } from "@/lib/course/migrate-guest-progress";
import { getFirebaseErrorMessage } from "@/lib/firebase-errors";
import { signupSchema, PASSWORD_RULES } from "@/lib/auth/password-validation";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InfoHoverCard } from "@/components/ui/InfoHoverCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function getSafeNext(raw: string | null): string {
  if (!raw) return "/";
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
}

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>({});
  const [isPending, startTransition] = useTransition();

  const passwordRuleResults = PASSWORD_RULES.map((rule) => ({
    label: rule.label,
    passed: rule.test(password),
  }));

  function validate() {
    const result = signupSchema.safeParse({ email, password, confirmPassword });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
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

        const next = getSafeNext(
          new URLSearchParams(window.location.search).get("next"),
        );
        window.location.assign(next);
      } catch (err) {
        const code = (err as { code?: string }).code ?? "";
        setErrors({ form: getFirebaseErrorMessage(code) });
      }
    });
  }

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
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            disabled={isPending}
            aria-invalid={!!errors.password}
            aria-describedby="password-rules"
          />
          <ul id="password-rules" className="flex flex-col gap-1 mt-1">
            {passwordRuleResults.map((rule) => (
              <li
                key={rule.label}
                className={cn(
                  "flex items-center gap-1.5 text-xs",
                  passwordTouched || password.length > 0
                    ? rule.passed
                      ? "text-feedback-success"
                      : "text-feedback-destructive"
                    : "text-muted-foreground",
                )}
              >
                {passwordTouched || password.length > 0 ? (
                  rule.passed ? (
                    <CheckIcon className="size-3 shrink-0 text-feedback-success" />
                  ) : (
                    <XIcon className="size-3 shrink-0" />
                  )
                ) : (
                  <span className="size-3 shrink-0 rounded-full border border-current inline-block" />
                )}
                {rule.label}
              </li>
            ))}
          </ul>
          {errors.password && (
            <p className="text-sm text-feedback-destructive" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-confirm">Potwierdź hasło</Label>
          <Input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isPending}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? "confirm-error" : undefined
            }
          />
          {errors.confirmPassword && (
            <p
              id="confirm-error"
              className="text-sm text-feedback-destructive"
              role="alert"
            >
              {errors.confirmPassword}
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
                Otrzymuj na swój email dodatkowe materiały, praktyczne
                wskazówki, informacje o nowych kursach i filmach oraz
                aktualizacjach platformy.
              </p>
            </InfoHoverCard>
          </div>
        </div>

        {errors.form && (
          <p className="text-sm text-feedback-destructive" role="alert">
            {errors.form}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Tworzenie konta..." : "Utwórz konto"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Masz już konto?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Zaloguj się
        </Link>
      </p>
    </div>
  );
}
