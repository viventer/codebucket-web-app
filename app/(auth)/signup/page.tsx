import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Utwórz konto – CodeBucket",
};

export default function SignupPage() {
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold">Utwórz konto</h1>
      <SignupForm />
    </>
  );
}
