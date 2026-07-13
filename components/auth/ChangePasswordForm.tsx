"use client";

import { useState, useEffect, useTransition } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "@/firebase/init";
import { getFirebaseErrorMessage } from "@/lib/firebase-errors";
import {
  changePasswordSchema,
  PASSWORD_RULES,
} from "@/lib/password-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { CheckIcon, XIcon, RefreshCwIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  applyOtpSendResult,
  getOtpCooldownSecondsLeft,
} from "@/lib/otp-cooldown";
import { useToast } from "@/hooks/use-toast";
import {
  sendPasswordChangeOtp,
  verifyPasswordChangeOtp,
} from "@/actions/auth/password-change";

type Step = "credentials" | "otp";

type ChangePasswordFormProps = {
  uid: string;
  email: string;
};

export function ChangePasswordForm({ uid, email }: ChangePasswordFormProps) {
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordTouched, setNewPasswordTouched] = useState(false);
  const [step1Errors, setStep1Errors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    form?: string;
  }>({});
  const [isPendingStep1, startStep1Transition] = useTransition();

  const [step, setStep] = useState<Step>("credentials");
  const [code, setCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [tooManyAttempts, setTooManyAttempts] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [maxResendsReached, setMaxResendsReached] = useState(false);
  const [isPendingOtp, startOtpTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();

  useEffect(() => {
    if (!cooldownUntil) return;
    const update = () => {
      const left = getOtpCooldownSecondsLeft(cooldownUntil);
      if (left <= 0) {
        setSecondsLeft(0);
        setCooldownUntil(null);
      } else {
        setSecondsLeft(left);
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  const passwordRuleResults = PASSWORD_RULES.map((rule) => ({
    label: rule.label,
    passed: rule.test(newPassword),
  }));

  function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setStep1Errors({
        currentPassword: fieldErrors.currentPassword?.[0],
        newPassword: fieldErrors.newPassword?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }
    setStep1Errors({});
    startStep1Transition(async () => {
      try {
        const user = auth.currentUser;
        if (!user || !user.email) {
          setStep1Errors({ form: "Użytkownik nie jest zalogowany." });
          return;
        }
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword,
        );
        await reauthenticateWithCredential(user, credential);
      } catch (err) {
        const firebaseCode = (err as { code?: string }).code ?? "";
        if (
          firebaseCode === "auth/invalid-credential" ||
          firebaseCode === "auth/wrong-password"
        ) {
          setStep1Errors({
            currentPassword: "Aktualne hasło jest nieprawidłowe.",
          });
        } else {
          setStep1Errors({ form: getFirebaseErrorMessage(firebaseCode) });
        }
        return;
      }

      const otpResult = await sendPasswordChangeOtp(uid, email);
      if (!otpResult.success) {
        applyOtpSendResult(otpResult, { setCooldownUntil });
        if (!otpResult.cooldownUntil) {
          setStep1Errors({ form: otpResult.error });
        }
        return;
      }
      applyOtpSendResult(otpResult, { setCooldownUntil });
      setSecondsLeft(getOtpCooldownSecondsLeft(otpResult.cooldownUntil));
      setStep("otp");
    });
  }

  function handleVerifyOtp() {
    if (code.length !== 6) return;
    setOtpError(null);
    startOtpTransition(async () => {
      const result = await verifyPasswordChangeOtp(uid, code);
      if (!result.success) {
        setOtpError(result.error);
        if (result.tooManyAttempts) setTooManyAttempts(true);
        setCode("");
        return;
      }

      try {
        const user = auth.currentUser;
        if (!user || !user.email) {
          setOtpError("Użytkownik nie jest zalogowany.");
          return;
        }

        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword,
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);

        toast.success("Hasło zostało zmienione.");
        window.location.assign("/");
      } catch (err) {
        const firebaseCode = (err as { code?: string }).code ?? "";
        setOtpError(getFirebaseErrorMessage(firebaseCode));
        setCode("");
      }
    });
  }

  function handleResend() {
    setOtpError(null);
    setTooManyAttempts(false);
    setCode("");
    startResendTransition(async () => {
      const result = await sendPasswordChangeOtp(uid, email);
      applyOtpSendResult(result, {
        setCooldownUntil,
        setError: setOtpError,
        setMaxResendsReached,
      });
    });
  }

  const verifyDisabled =
    isPendingOtp || isResending || code.length !== 6 || tooManyAttempts;
  const resendDisabled =
    isResending || isPendingOtp || maxResendsReached || secondsLeft > 0;

  return (
    <form
      onSubmit={handleStep1Submit}
      noValidate
      className="relative flex flex-col gap-4"
    >
      <input
        type="email"
        id="change-password-email"
        name="email"
        autoComplete="username"
        value={email}
        readOnly
        tabIndex={-1}
        className="absolute h-px w-px overflow-hidden border-0 p-0 [clip:rect(0,0,0,0)]"
      />

      {/* Keep password fields in DOM so password managers detect the change */}
      <div
        className={cn(step === "otp" && "sr-only")}
        aria-hidden={step === "otp"}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="current-password">Aktualne hasło</Label>
            <Input
              id="current-password"
              name="current-password"
              type="password"
              autoComplete="current-password"
              readOnly={step === "credentials"}
              onFocus={(e) => {
                if (step === "credentials") {
                  e.currentTarget.readOnly = false;
                }
              }}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isPendingStep1 || step === "otp"}
              aria-invalid={!!step1Errors.currentPassword}
              tabIndex={step === "otp" ? -1 : undefined}
            />
            {step1Errors.currentPassword && (
              <p className="text-sm text-feedback-destructive" role="alert">
                {step1Errors.currentPassword}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-password">Nowe hasło</Label>
            <Input
              id="new-password"
              name="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onBlur={() => setNewPasswordTouched(true)}
              disabled={isPendingStep1 || step === "otp"}
              aria-invalid={!!step1Errors.newPassword}
              tabIndex={step === "otp" ? -1 : undefined}
            />
            {step === "credentials" && (
              <ul className="flex flex-col gap-1 mt-0.5">
                {passwordRuleResults.map((rule) => (
                  <li
                    key={rule.label}
                    className={cn(
                      "flex items-center gap-1.5 text-xs",
                      newPasswordTouched || newPassword.length > 0
                        ? rule.passed
                          ? "text-feedback-success"
                          : "text-feedback-destructive"
                        : "text-muted-foreground",
                    )}
                  >
                    {newPasswordTouched || newPassword.length > 0 ? (
                      rule.passed ? (
                        <CheckIcon className="size-3 shrink-0" />
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
            )}
            {step1Errors.newPassword && (
              <p className="text-sm text-feedback-destructive" role="alert">
                {step1Errors.newPassword}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm-password">Potwierdź nowe hasło</Label>
            <Input
              id="confirm-password"
              name="confirm-new-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isPendingStep1 || step === "otp"}
              aria-invalid={!!step1Errors.confirmPassword}
              tabIndex={step === "otp" ? -1 : undefined}
            />
            {step1Errors.confirmPassword && (
              <p className="text-sm text-feedback-destructive" role="alert">
                {step1Errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
      </div>

      {step === "credentials" ? (
        <>
          {step1Errors.form && (
            <p className="text-sm text-feedback-destructive" role="alert">
              {step1Errors.form}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isPendingStep1}>
            {isPendingStep1 ? "Weryfikowanie..." : "Dalej"}
          </Button>
        </>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">
              Wysłaliśmy kod weryfikacyjny na adres{" "}
              <span className="font-medium text-foreground">{email}</span>.
              Wprowadź go, aby potwierdzić zmianę hasła.
            </p>
            <p className="text-xs text-muted-foreground">
              Kod jest ważny przez 10 minut.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Kod weryfikacyjny</label>
            <div className="flex items-center justify-between gap-2">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                disabled={isPendingOtp || tooManyAttempts}
                aria-invalid={!!otpError}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={resendDisabled}
                className="shrink-0 text-xs"
              >
                <RefreshCwIcon
                  className={cn("size-3.5", isResending && "animate-spin")}
                />
                {secondsLeft > 0
                  ? `Wyślij ponownie za ${secondsLeft}s`
                  : "Wyślij ponownie"}
              </Button>
            </div>

            {otpError && (
              <p className="text-sm text-feedback-destructive" role="alert">
                {otpError}
              </p>
            )}
          </div>

          {maxResendsReached && (
            <p className="text-sm text-muted-foreground text-center">
              Napotkałeś problemy?{" "}
              <a
                href="mailto:support@codebucket.pl"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Skontaktuj się z pomocą techniczną
              </a>
            </p>
          )}

          <Button
            type="button"
            onClick={handleVerifyOtp}
            disabled={verifyDisabled}
            className="w-full"
          >
            {isPendingOtp ? "Weryfikowanie..." : "Potwierdź zmianę hasła"}
          </Button>
        </div>
      )}
    </form>
  );
}
