import { Suspense } from "react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegistrationRequiredButtons } from "@/components/auth/RegistrationRequiredButtons";

export const metadata = {
  title: "Załóż darmowe konto – CodeBucket",
};

export default function RegistrationRequiredPage() {
  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Załóż darmowe konto
        </CardTitle>
        <CardDescription className="mt-1">
          Potrzebujesz konta, aby zapisać postęp i przejść do kolejnej sekcji.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <RegistrationRequiredButtons />
        </Suspense>
      </CardContent>
    </>
  );
}
