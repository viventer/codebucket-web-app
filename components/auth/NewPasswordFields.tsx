import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordRulesList } from "@/components/auth/PasswordRulesList";

type NewPasswordErrors = {
  newPassword?: string;
  confirmPassword?: string;
};

type NewPasswordFieldsProps = {
  newPassword: string;
  confirmPassword: string;
  newPasswordTouched: boolean;
  errors: NewPasswordErrors;
  isPending: boolean;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onNewPasswordBlur: () => void;
};

export function NewPasswordFields({
  newPassword,
  confirmPassword,
  newPasswordTouched,
  errors,
  isPending,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onNewPasswordBlur,
}: NewPasswordFieldsProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-password">Nowe hasło</Label>
        <Input
          id="new-password"
          name="new-password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => onNewPasswordChange(e.target.value)}
          onBlur={onNewPasswordBlur}
          disabled={isPending}
          aria-invalid={!!errors.newPassword}
        />
        <PasswordRulesList password={newPassword} touched={newPasswordTouched} />
        {errors.newPassword && (
          <p className="text-sm text-feedback-destructive" role="alert">
            {errors.newPassword}
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
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          disabled={isPending}
          aria-invalid={!!errors.confirmPassword}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-feedback-destructive" role="alert">
            {errors.confirmPassword}
          </p>
        )}
      </div>
    </>
  );
}
