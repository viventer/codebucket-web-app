import { OtpEmail } from "@/emails/otp-email";

interface PasswordResetOtpEmailProps {
  code: string;
  ttlMinutes: number;
}

export const previewProps: PasswordResetOtpEmailProps = {
  code: "512847",
  ttlMinutes: 10,
};

export function PasswordResetOtpEmail({
  code,
  ttlMinutes,
}: PasswordResetOtpEmailProps) {
  return (
    <OtpEmail
      previewText="Twój kod do resetowania hasła w CodeBucket"
      heading="Zresetuj hasło"
      description="Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta. Wprowadź poniższy kod, aby kontynuować."
      footerNote="Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość — Twoje hasło pozostanie bez zmian."
      code={code}
      ttlMinutes={ttlMinutes}
    />
  );
}

export default PasswordResetOtpEmail;
