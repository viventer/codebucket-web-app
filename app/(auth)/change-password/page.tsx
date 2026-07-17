import { ChangePasswordCard } from "@/components/auth/ChangePasswordCard";
import { getSessionUser } from "@/lib/auth/session";
import { userCanChangePassword } from "@/lib/auth/user-can-change-password";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Zmień hasło – CodeBucket",
};

export default async function ChangePasswordPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const canChangePassword = await userCanChangePassword(user.uid);
  if (!canChangePassword) redirect("/");

  return <ChangePasswordCard uid={user.uid} email={user.email} />;
}
