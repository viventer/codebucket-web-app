import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
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
      <h1 className="mb-2 text-center text-2xl font-bold">Zmień hasło</h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Po podaniu nowego hasła wyślemy kod weryfikacyjny na Twój adres email.
      </p>
      <ChangePasswordForm uid={user.uid} email={user.email} />
    </>
  );
}
