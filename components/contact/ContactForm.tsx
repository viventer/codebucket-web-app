"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { ContactAttachmentsField } from "@/components/contact/ContactAttachmentsField";
import { ContactEmailField } from "@/components/contact/ContactEmailField";
import { ContactFieldError } from "@/components/contact/ContactFieldError";
import { ContactMessageField } from "@/components/contact/ContactMessageField";
import { ContactReasonField } from "@/components/contact/ContactReasonField";
import { Button } from "@/components/ui/button";
import {
  buildContactFormData,
  CONTACT_SUBMIT_ERROR,
  createSelectedAttachments,
  getAttachmentSelectionError,
  getContactFieldErrors,
  revokeAttachmentPreview,
  type ContactFieldErrors,
  type SelectedAttachment,
} from "@/lib/contact/contact-form-helpers";
import type { ContactReasonValue } from "@/schemas/contactSchema";

type ContactFormProps = {
  defaultEmail: string;
};

export function ContactForm({ defaultEmail }: ContactFormProps) {
  const router = useRouter();
  const [reason, setReason] = useState<ContactReasonValue | undefined>();
  const [email, setEmail] = useState(defaultEmail);
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<SelectedAttachment[]>([]);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [isPending, startTransition] = useTransition();

  function clearError(field: keyof ContactFieldErrors) {
    setErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    );
  }

  function handleSelectFiles(selected: File[]) {
    const selectionError = getAttachmentSelectionError(
      attachments.length,
      selected,
    );
    if (selectionError) {
      setErrors({ attachments: selectionError });
      return;
    }

    setAttachments((current) => [
      ...current,
      ...createSelectedAttachments(selected),
    ]);
    clearError("attachments");
  }

  function handleRemoveAttachment(id: string) {
    setAttachments((current) => {
      const removed = current.find((attachment) => attachment.id === id);
      if (removed) {
        revokeAttachmentPreview(removed);
      }
      return current.filter((attachment) => attachment.id !== id);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const files = attachments.map((attachment) => attachment.file);
    const fieldErrors = getContactFieldErrors({
      reason,
      email,
      message,
      files,
    });
    if (fieldErrors || !reason) {
      setErrors(fieldErrors ?? {});
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          body: buildContactFormData({ reason, email, message, files }),
        });

        if (response.status === 401) {
          router.push("/login?next=/contact");
          return;
        }

        const result = (await response.json()) as {
          success?: boolean;
          error?: string;
        };

        if (!response.ok || !result.success) {
          setErrors({ form: result.error ?? CONTACT_SUBMIT_ERROR });
          return;
        }

        router.push(`/contact/thank-you?reason=${encodeURIComponent(reason)}`);
      } catch {
        setErrors({ form: CONTACT_SUBMIT_ERROR });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <ContactReasonField
        value={reason}
        error={errors.reason}
        disabled={isPending}
        onChange={(value) => {
          setReason(value);
          clearError("reason");
        }}
      />
      <ContactEmailField
        value={email}
        error={errors.email}
        disabled={isPending}
        onChange={(value) => {
          setEmail(value);
          clearError("email");
        }}
      />
      <ContactMessageField
        value={message}
        error={errors.message}
        disabled={isPending}
        onChange={(value) => {
          setMessage(value);
          clearError("message");
        }}
      />
      <ContactAttachmentsField
        attachments={attachments}
        error={errors.attachments}
        disabled={isPending}
        onSelect={handleSelectFiles}
        onRemove={handleRemoveAttachment}
      />
      {errors.form ? <ContactFieldError>{errors.form}</ContactFieldError> : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Wysyłanie..." : "Wyślij"}
      </Button>
    </form>
  );
}
