import { Suspense } from "react";
import { SignupForm } from "@/components/auth/SignupForm";
import { SignupHeading } from "@/components/auth/SignupHeading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata = {
  title: "Załóż darmowe konto – CodeBucket",
};

export default function SignupPage() {
  return (
    <Card>
      <CardHeader>
        <Suspense>
          <SignupHeading />
        </Suspense>
      </CardHeader>
      <CardContent>
        <Suspense>
          <SignupForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
