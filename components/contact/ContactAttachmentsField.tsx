"use client";

import { useRef } from "react";

import { ContactAddAttachment } from "@/components/contact/ContactAddAttachment";
import { ContactFieldError } from "@/components/contact/ContactFieldError";
import { ContactSelectedAttachment } from "@/components/contact/ContactSelectedAttachment";
import { Label } from "@/components/ui/label";
import {
  CONTACT_ATTACHMENT_ACCEPT,
  type SelectedAttachment,
} from "@/lib/contact/contact-form-helpers";
import { MAX_ATTACHMENTS } from "@/schemas/contactSchema";

type ContactAttachmentsFieldProps = {
  attachments: SelectedAttachment[];
  error?: string;
  disabled: boolean;
  onSelect: (files: File[]) => void;
  onRemove: (id: string) => void;
};

export function ContactAttachmentsField({
  attachments,
  error,
  disabled,
  onSelect,
  onRemove,
}: ContactAttachmentsFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const atLimit = attachments.length >= MAX_ATTACHMENTS;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="contact-attachments">Załączniki</Label>
      <input
        ref={fileInputRef}
        id="contact-attachments"
        type="file"
        multiple
        accept={CONTACT_ATTACHMENT_ACCEPT}
        className="sr-only"
        disabled={disabled || atLimit}
        onChange={(e) => {
          onSelect(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
        aria-invalid={!!error}
        aria-describedby={error ? "contact-attachments-error" : undefined}
      />
      <div className="flex flex-col gap-2">
        {attachments.map((attachment) => (
          <ContactSelectedAttachment
            key={attachment.id}
            attachment={attachment}
            disabled={disabled}
            onRemove={onRemove}
          />
        ))}
        {atLimit ? null : (
          <ContactAddAttachment
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
          />
        )}
      </div>
      {error ? (
        <ContactFieldError id="contact-attachments-error">
          {error}
        </ContactFieldError>
      ) : null}
    </div>
  );
}
