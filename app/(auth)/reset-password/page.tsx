import { ResetPasswordCard } from "@/components/auth/ResetPasswordCard";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Zresetuj hasło – CodeBucket",
};

export default function ResetPasswordPage() {
  return (
    <Card>
      <ResetPasswordCard />
    </Card>
  );
}
