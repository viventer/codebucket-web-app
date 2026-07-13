import { LoginForm } from "@/components/auth/LoginForm";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Zaloguj się – CodeBucket",
};

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/");

  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold">Zaloguj się</h1>
      <LoginForm />
    </>
  );
}
