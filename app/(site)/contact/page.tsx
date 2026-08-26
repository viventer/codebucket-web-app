import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ContactForm } from "@/components/contact/ContactForm";
import { MainContainer } from "@/components/MainContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Kontakt – CodeBucket",
};

export default async function ContactPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login?next=/contact");
  }

  return (
    <MainContainer className="items-center gap-8 sm:gap-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Formularz kontaktowy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm defaultEmail={sessionUser.email} />
          </CardContent>
        </Card>
      </div>
    </MainContainer>
  );
}
