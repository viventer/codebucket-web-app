import { SignupForm } from "@/components/auth/SignupForm";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Utwórz konto – CodeBucket",
};

export default async function SignupPage() {
  const user = await getSessionUser();
  if (user) redirect("/");

  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold">Utwórz konto</h1>
      <SignupForm />
    </>
  );
}
