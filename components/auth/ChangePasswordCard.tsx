"use client";

import { useState, useEffect, useTransition } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "@/firebase/init";
import { getFirebaseErrorMessage } from "@/lib/firebase-errors";
import { changePasswordSchema } from "@/lib/password-validation";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  applyOtpSendResult,
  getOtpCooldownSecondsLeft,
} from "@/lib/otp-cooldown";
import { useToast } from "@/hooks/use-toast";
import {
  sendPasswordChangeOtp,
  verifyPasswordChangeOtp,
} from "@/actions/auth/password-change";
import { ChangePasswordCredentialsFields } from "@/components/auth/ChangePasswordCredentialsFields";
import { ChangePasswordOtpStep } from "@/components/auth/ChangePasswordOtpStep";

type Step = "credentials" | "otp";

type ChangePasswordCardProps = {
  uid: string;
  email: string;
};

export function ChangePasswordCard({ uid, email }: ChangePasswordCardProps) {
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
    <>
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Zmień hasło
        </CardTitle>
        <CardDescription className="text-center text-sm text-muted-foreground">
          {step === "credentials" ? (
            "Po podaniu nowego hasła wyślemy kod weryfikacyjny na Twój adres email."
          ) : (
            <>
              Wysłaliśmy kod weryfikacyjny na adres{" "}
              <span className="font-medium text-foreground">{email}</span>.
              Wprowadź go, aby potwierdzić zmianę hasła. Kod jest ważny przez
              10 minut.
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleStep1Submit}
          noValidate
          className="relative flex flex-col gap-4"
        >
          <ChangePasswordCredentialsFields
            email={email}
            step={step}
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            newPasswordTouched={newPasswordTouched}
            errors={step1Errors}
            isPending={isPendingStep1}
            onCurrentPasswordChange={setCurrentPassword}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onNewPasswordBlur={() => setNewPasswordTouched(true)}
          />

          {step === "otp" && (
            <ChangePasswordOtpStep
              code={code}
              otpError={otpError}
              tooManyAttempts={tooManyAttempts}
              maxResendsReached={maxResendsReached}
              secondsLeft={secondsLeft}
              isPendingOtp={isPendingOtp}
              isResending={isResending}
              verifyDisabled={verifyDisabled}
              resendDisabled={resendDisabled}
              onCodeChange={setCode}
              onVerify={handleVerifyOtp}
              onResend={handleResend}
            />
          )}
        </form>
      </CardContent>
    </>
  );
}
