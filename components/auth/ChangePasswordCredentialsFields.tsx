import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { NewPasswordFields } from "@/components/auth/NewPasswordFields";

type Step1Errors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  form?: string;
};

type ChangePasswordCredentialsFieldsProps = {
  email: string;
  step: "credentials" | "otp";
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  newPasswordTouched: boolean;
  errors: Step1Errors;
  isPending: boolean;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onNewPasswordBlur: () => void;
};

export function ChangePasswordCredentialsFields({
  email,
  step,
  currentPassword,
  newPassword,
  confirmPassword,
  newPasswordTouched,
  errors,
  isPending,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onNewPasswordBlur,
}: ChangePasswordCredentialsFieldsProps) {
  const isOtpStep = step === "otp";

  return (
    <>
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

      <div
        className={cn(isOtpStep && "sr-only")}
        aria-hidden={isOtpStep}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="current-password">Aktualne hasło</Label>
            <Input
              id="current-password"
              name="current-password"
              type="password"
              autoComplete="current-password"
              readOnly={!isOtpStep}
              onFocus={(e) => {
                if (!isOtpStep) {
                  e.currentTarget.readOnly = false;
                }
              }}
              value={currentPassword}
              onChange={(e) => onCurrentPasswordChange(e.target.value)}
              disabled={isPending || isOtpStep}
              aria-invalid={!!errors.currentPassword}
              tabIndex={isOtpStep ? -1 : undefined}
            />
            {errors.currentPassword && (
              <p className="text-sm text-feedback-destructive" role="alert">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <NewPasswordFields
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            newPasswordTouched={newPasswordTouched}
            errors={errors}
            isPending={isPending || isOtpStep}
            onNewPasswordChange={onNewPasswordChange}
            onConfirmPasswordChange={onConfirmPasswordChange}
            onNewPasswordBlur={onNewPasswordBlur}
          />
        </div>
      </div>

      {step === "credentials" && (
        <>
          {errors.form && (
            <p className="text-sm text-feedback-destructive" role="alert">
              {errors.form}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Weryfikowanie..." : "Dalej"}
          </Button>
        </>
      )}
    </>
  );
}
