"use server";

import * as React from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailAttachment {
  filename: string;
  content: Buffer;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactNode;
  replyTo?: string;
  attachments?: SendEmailAttachment[];
}

type SendEmailResult = { success: true } | { success: false; error: string };

export async function sendEmail({
  to,
  subject,
  react,
  replyTo = "kontakt@codebucket.pl",
  attachments,
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
    replyTo,
    subject,
    react,
    attachments,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
