import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Zaloguj się – CodeBucket",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold">Zaloguj się</h1>
      <LoginForm />
    </>
  );
}
