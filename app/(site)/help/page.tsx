import { LegalDocument, LegalHeader } from "@/components/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pomoc i kontakt – CodeBucket",
};

export default function HelpAndContactPage() {
  return (
    <LegalDocument>
      <LegalHeader title="Pomoc i kontakt" />
    </LegalDocument>
  );
}
