import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Zaloguj się – CodeBucket",
};

export default function LoginPage() {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Zaloguj się
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense>
          <LoginForm />
        </Suspense>
      </CardContent>
    </>
  );
}
