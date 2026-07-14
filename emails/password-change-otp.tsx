import { OtpEmail } from "@/emails/otp-email";

interface PasswordChangeOtpEmailProps {
  code: string;
  ttlMinutes: number;
}

export const previewProps: PasswordChangeOtpEmailProps = {
  code: "847291",
  ttlMinutes: 10,
};

export function PasswordChangeOtpEmail({
  code,
  ttlMinutes,
}: PasswordChangeOtpEmailProps) {
  return (
    <OtpEmail
      previewText="Twój kod do zmiany hasła w CodeBucket"
      heading="Potwierdź zmianę hasła"
      description="Otrzymaliśmy prośbę o zmianę hasła do Twojego konta. Wprowadź poniższy kod, aby potwierdzić operację."
      footerNote="Jeśli nie inicjowałeś zmiany hasła, zignoruj tę wiadomość — Twoje hasło pozostanie bez zmian. Jeśli uważasz, że ktoś próbuje uzyskać dostęp do Twojego konta, zmień hasło jak najszybciej."
      code={code}
      ttlMinutes={ttlMinutes}
    />
  );
}

export default PasswordChangeOtpEmail;
