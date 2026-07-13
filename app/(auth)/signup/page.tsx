import { SignupForm } from "@/components/auth/SignupForm";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Utwórz konto – CodeBucket",
};

export default function SignupPage() {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Utwórz konto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </>
  );
}
