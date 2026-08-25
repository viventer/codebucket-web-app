"use server";

import * as React from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactNode;
}

type SendEmailResult = { success: true } | { success: false; error: string };

export async function sendEmail({
  to,
  subject,
  react,
}: SendEmailOptions): Promise<SendEmailResult> {
  const { error } = await resend.emails.send({
    from:
      process.env.NODE_ENV === "production"
        ? "CodeBucket <powiadomienia@mail.codebucket.pl>"
        : "CodeBucket <onboarding@resend.dev>",
    to:
      process.env.NODE_ENV === "production"
        ? to
        : "kontakt.codebucket@gmail.com",
    replyTo: "kontakt@codebucket.pl",
    subject,
    react,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
