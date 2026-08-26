import type { Metadata } from "next";

import { ContactThankYouView } from "@/components/contact/ContactThankYouView";
import {
  DEFAULT_THANK_YOU_MESSAGE,
  getContactReason,
} from "@/schemas/contactSchema";

type ContactThankYouPageProps = {
  searchParams: Promise<{
    reason?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Dziękujemy za zgłoszenie – CodeBucket",
};

export default async function ContactThankYouPage({
  searchParams,
}: ContactThankYouPageProps) {
  const params = await searchParams;
  const reason = getContactReason(params.reason);

  return (
    <ContactThankYouView
      message={reason?.thankYouMessage ?? DEFAULT_THANK_YOU_MESSAGE}
    />
  );
}
