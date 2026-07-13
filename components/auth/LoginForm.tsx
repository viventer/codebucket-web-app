"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { flattenError } from "zod";
import { auth } from "@/firebase/init";
import { createSession } from "@/actions/auth/session";
import { getFirebaseErrorMessage } from "@/lib/firebase-errors";
import { loginSchema } from "@/lib/password-validation";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [isPending, startTransition] = useTransition();

  function validate() {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors = flattenError(result.error).fieldErrors;
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
        const credential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const idToken = await credential.user.getIdToken();
        const result = await createSession(idToken);
        if (!result.success) {
          setErrors({ form: result.error });
          return;
        }
        router.push("/");
        router.refresh();
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Hasło</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p
              id="password-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.password}
            </p>
          )}
        </div>

        {errors.form && (
          <p className="text-sm text-destructive" role="alert">
            {errors.form}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Logowanie..." : "Zaloguj się"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Nie masz konta?{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Rejestracja
        </Link>
      </p>
    </div>
  );
}
