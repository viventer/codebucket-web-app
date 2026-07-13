import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSessionUser } from "@/lib/session";
import { userCanChangePassword } from "@/lib/user-can-change-password";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Zmień hasło – CodeBucket",
};

export default async function ChangePasswordPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const canChangePassword = await userCanChangePassword(user.uid);
  if (!canChangePassword) redirect("/");

  return (
    <>
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Zmień hasło
        </CardTitle>
        <CardDescription className="text-center text-sm text-muted-foreground">
          Po podaniu nowego hasła wyślemy kod weryfikacyjny na Twój adres email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm uid={user.uid} email={user.email} />
      </CardContent>
    </>
  );
}
