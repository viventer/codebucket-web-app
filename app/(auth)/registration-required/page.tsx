import { CardContent, CardHeader } from "@/components/ui/card";
import { RegistrationRequiredButtons } from "@/components/auth/RegistrationRequiredButtons";
import { RegistrationRequiredCopy } from "@/components/auth/RegistrationRequiredCopy";

export const metadata = {
  title: "Załóż darmowe konto – CodeBucket",
};

export default function RegistrationRequiredPage() {
  return (
    <>
      <CardHeader className="text-center">
        <RegistrationRequiredCopy />
      </CardHeader>
      <CardContent>
        <RegistrationRequiredButtons />
      </CardContent>
    </>
  );
}
