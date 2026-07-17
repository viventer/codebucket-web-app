"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpStep } from "@/components/auth/OtpStep";
import { NewPasswordFields } from "@/components/auth/NewPasswordFields";
import {
  applyOtpSendResult,
  getOtpCooldownSecondsLeft,
} from "@/lib/otp/otp-cooldown";
import { useOtpCountdown } from "@/hooks/use-otp-countdown";
import { resetPasswordSchema } from "@/lib/auth/password-validation";
import {
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPasswordWithOtp,
} from "@/actions/auth/password-reset";

type Step = "email" | "otp" | "password";

export function ResetPasswordCard() {
  const router = useRouter();

  // Step 1: email
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isPendingEmail, startEmailTransition] = useTransition();

  // Step 2: OTP
  const [code, setCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [tooManyAttempts, setTooManyAttempts] = useState(false);
  const [maxResendsReached, setMaxResendsReached] = useState(false);
  const [isPendingOtp, startOtpTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const { setCooldownUntil, secondsLeft, setSecondsLeft } = useOtpCountdown();

  // Step 3: new password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordTouched, setNewPasswordTouched] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
    form?: string;
  }>({});
  const [isPendingReset, startResetTransition] = useTransition();

  const [step, setStep] = useState<Step>("email");

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Podaj adres email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Podaj prawidłowy adres email.");
      return;
    }
    setEmailError(null);
    startEmailTransition(async () => {
      const result = await sendPasswordResetOtp(trimmed);
      if (!result.success && !result.cooldownUntil) {
        setEmailError(result.error);
        return;
      }
      applyOtpSendResult(result, { setCooldownUntil });
      if (result.success) {
        setSecondsLeft(getOtpCooldownSecondsLeft(result.cooldownUntil));
      }
      setStep("otp");
    });
  }

  function handleVerifyOtp() {
    if (code.length !== 6) return;
    setOtpError(null);
    startOtpTransition(async () => {
      const result = await verifyPasswordResetOtp(email.trim(), code);
      if (!result.success) {
        setOtpError(result.error);
        if (result.tooManyAttempts) setTooManyAttempts(true);
        setCode("");
        return;
      }
      setStep("password");
    });
  }

  function handleResend() {
    setOtpError(null);
    setTooManyAttempts(false);
    setCode("");
    startResendTransition(async () => {
      const result = await sendPasswordResetOtp(email.trim());
      applyOtpSendResult(result, {
        setCooldownUntil,
        setError: setOtpError,
        setMaxResendsReached,
      });
    });
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = resetPasswordSchema.safeParse({
      newPassword,
      confirmPassword,
    });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setPasswordErrors({
        newPassword: fieldErrors.newPassword?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }
    setPasswordErrors({});
    startResetTransition(async () => {
      const resetResult = await resetPasswordWithOtp(
        email.trim(),
        code,
        newPassword,
      );
      if (!resetResult.success) {
        if (resetResult.tooManyAttempts) {
          // OTP was consumed or invalid — go back to OTP step
          setCode("");
          setOtpError(resetResult.error);
          setStep("otp");
        } else {
          setPasswordErrors({ form: resetResult.error });
        }
        return;
      }
      router.push("/login?passwordChanged=1");
    });
  }

  const verifyDisabled =
    isPendingOtp || isResending || code.length !== 6 || tooManyAttempts;
  const resendDisabled =
    isResending || isPendingOtp || maxResendsReached || secondsLeft > 0;

  return (
    <>
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Zresetuj hasło
        </CardTitle>
        <CardDescription className="text-center text-sm text-muted-foreground">
          {step === "email" &&
            "Podaj adres email powiązany z kontem. Wyślemy Ci kod weryfikacyjny."}
          {step === "otp" && (
            <>
              Wysłaliśmy kod weryfikacyjny na adres{" "}
              <span className="font-medium text-foreground">{email}</span>.
              Wprowadź go poniżej. Kod jest ważny przez 10 minut.
            </>
          )}
          {step === "password" && "Ustaw nowe hasło dla swojego konta."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === "email" && (
          <form
            onSubmit={handleEmailSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPendingEmail}
                aria-invalid={!!emailError}
              />
              {emailError && (
                <p className="text-sm text-feedback-destructive" role="alert">
                  {emailError}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPendingEmail}>
              {isPendingEmail ? "Wysyłanie..." : "Wyślij kod"}
            </Button>
          </form>
        )}

        {step === "otp" && (
          <OtpStep
            code={code}
            otpError={otpError}
            tooManyAttempts={tooManyAttempts}
            maxResendsReached={maxResendsReached}
            secondsLeft={secondsLeft}
            isPendingOtp={isPendingOtp}
            isResending={isResending}
            verifyDisabled={verifyDisabled}
            resendDisabled={resendDisabled}
            submitLabel="Potwierdź kod"
            onCodeChange={setCode}
            onVerify={handleVerifyOtp}
            onResend={handleResend}
          />
        )}

        {step === "password" && (
          <form
            onSubmit={handlePasswordSubmit}
            noValidate
            className="relative flex flex-col gap-4"
          >
            <input
              type="email"
              id="reset-password-email"
              name="email"
              autoComplete="username"
              value={email.trim()}
              readOnly
              tabIndex={-1}
              className="absolute h-px w-px overflow-hidden border-0 p-0 [clip:rect(0,0,0,0)]"
            />
            <NewPasswordFields
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              newPasswordTouched={newPasswordTouched}
              errors={passwordErrors}
              isPending={isPendingReset}
              onNewPasswordChange={setNewPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onNewPasswordBlur={() => setNewPasswordTouched(true)}
            />
            {passwordErrors.form && (
              <p className="text-sm text-feedback-destructive" role="alert">
                {passwordErrors.form}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isPendingReset}>
              {isPendingReset ? "Zapisywanie..." : "Ustaw nowe hasło"}
            </Button>
          </form>
        )}
      </CardContent>
    </>
  );
}
