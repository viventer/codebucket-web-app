"use client";

import { ContactFieldError } from "@/components/contact/ContactFieldError";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContactMessageFieldProps = {
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (value: string) => void;
};

export function ContactMessageField({
  value,
  error,
  disabled,
  onChange,
}: ContactMessageFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="contact-message">Treść zgłoszenia</Label>
      <Textarea
        id="contact-message"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? "contact-message-error" : undefined}
      />
      {error ? (
        <ContactFieldError id="contact-message-error">
          {error}
        </ContactFieldError>
      ) : null}
    </div>
  );
}
