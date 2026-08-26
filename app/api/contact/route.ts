import { NextResponse } from "next/server";

import { ContactMessageEmail } from "@/emails/contact-message";
import { getSessionUser } from "@/lib/auth/session";
import {
  releaseContactSlot,
  reserveContactSlot,
} from "@/lib/contact/contact-rate-limit";
import { sendEmail } from "@/lib/email/send-email";
import {
  contactInputSchema,
  getContactReason,
  MAX_ATTACHMENT_BYTES,
  MAX_ATTACHMENTS,
  MAX_CONTACT_PER_DAY,
} from "@/schemas/contactSchema";

export const runtime = "nodejs";

type ContactApiResult =
  | { success: true }
  | { success: false; error: string };

function json(body: ContactApiResult, status = 200) {
  return NextResponse.json(body, { status });
}

function collectAttachments(formData: FormData): File[] {
  return formData
    .getAll("attachments")
    .filter((value): value is File => value instanceof File && value.size > 0);
}

export async function POST(request: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return json(
      {
        success: false,
        error: "Musisz być zalogowany, aby wysłać zgłoszenie.",
      },
      401,
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json(
      { success: false, error: "Nie udało się odczytać formularza." },
      400,
    );
  }

  const parsed = contactInputSchema.safeParse({
    reason: formData.get("reason") ?? "",
    email: formData.get("email") ?? "",
    message: formData.get("message") ?? "",
  });

  if (!parsed.success) {
    return json(
      {
        success: false,
        error:
          parsed.error.issues[0]?.message ?? "Nieprawidłowe dane zgłoszenia.",
      },
      400,
    );
  }

  const files = collectAttachments(formData);
  if (files.length > MAX_ATTACHMENTS) {
    return json(
      {
        success: false,
        error: `Możesz dodać maksymalnie ${MAX_ATTACHMENTS} załączniki.`,
      },
      400,
    );
  }

  const oversized = files.find((file) => file.size > MAX_ATTACHMENT_BYTES);
  if (oversized) {
    return json(
      {
        success: false,
        error: "Każdy załącznik może mieć maksymalnie 8 MB.",
      },
      400,
    );
  }

  const reason = getContactReason(parsed.data.reason);
  if (!reason) {
    return json(
      { success: false, error: "Wybierz powód zgłoszenia." },
      400,
    );
  }

  const reserved = await reserveContactSlot(sessionUser.uid);
  if (!reserved.ok) {
    if (reserved.reason === "limit") {
      return json(
        {
          success: false,
          error: `Osiągnięto dzienny limit zgłoszeń (${MAX_CONTACT_PER_DAY}). Spróbuj ponownie jutro.`,
        },
        429,
      );
    }

    return json(
      {
        success: false,
        error: "Nie udało się wysłać zgłoszenia. Spróbuj ponownie.",
      },
      500,
    );
  }

  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
    })),
  );

  const contactId = `CB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  const emailResult = await sendEmail({
    to: reason.email,
    subject: `Zgłoszenie ${contactId}: ${reason.label}`,
    replyTo: parsed.data.email,
    react: ContactMessageEmail({
      contactId,
      reasonLabel: reason.label,
      senderEmail: parsed.data.email,
      message: parsed.data.message,
      attachmentNames: attachments.map((attachment) => attachment.filename),
    }),
    attachments,
  });

  if (!emailResult.success) {
    await releaseContactSlot(sessionUser.uid);
    console.error("Contact email failed:", emailResult.error);
    return json(
      {
        success: false,
        error: "Nie udało się wysłać zgłoszenia. Spróbuj ponownie.",
      },
      500,
    );
  }

  return json({ success: true });
}
