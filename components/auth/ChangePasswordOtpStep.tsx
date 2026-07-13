import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { RefreshCwIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ChangePasswordOtpStepProps = {
  code: string;
  otpError: string | null;
  tooManyAttempts: boolean;
  maxResendsReached: boolean;
  secondsLeft: number;
  isPendingOtp: boolean;
  isResending: boolean;
  verifyDisabled: boolean;
  resendDisabled: boolean;
  onCodeChange: (value: string) => void;
  onVerify: () => void;
  onResend: () => void;
};

export function ChangePasswordOtpStep({
  code,
  otpError,
  tooManyAttempts,
  maxResendsReached,
  secondsLeft,
  isPendingOtp,
  isResending,
  verifyDisabled,
  resendDisabled,
  onCodeChange,
  onVerify,
  onResend,
}: ChangePasswordOtpStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Kod weryfikacyjny</label>
        <div className="flex items-center justify-between gap-2">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={onCodeChange}
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
        </div>

        {otpError && (
          <p className="text-sm text-feedback-destructive" role="alert">
            {otpError}
          </p>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onResend}
          disabled={resendDisabled}
          className="flex gap-1 w-fit"
        >
          <RefreshCwIcon
            className={cn("size-3.5", isResending && "animate-spin")}
          />
          <span>
            {secondsLeft > 0
              ? `Wyślij ponownie za ${secondsLeft}s`
              : "Wyślij ponownie"}
          </span>
        </Button>
      </div>

      {maxResendsReached && (
        <p className="text-center text-sm text-muted-foreground">
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
        onClick={onVerify}
        disabled={verifyDisabled}
        className="w-full"
      >
        {isPendingOtp ? "Weryfikowanie..." : "Potwierdź zmianę hasła"}
      </Button>
    </div>
  );
}
