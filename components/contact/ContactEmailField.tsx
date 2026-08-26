"use client";

import { ContactFieldError } from "@/components/contact/ContactFieldError";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ContactEmailFieldProps = {
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (value: string) => void;
};

export function ContactEmailField({
  value,
  error,
  disabled,
  onChange,
}: ContactEmailFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="contact-email">Email</Label>
      <Input
        id="contact-email"
        type="email"
        autoComplete="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={
          error ? "contact-email-error" : "contact-email-hint"
        }
      />
      {error ? (
        <ContactFieldError id="contact-email-error">{error}</ContactFieldError>
      ) : (
        <p id="contact-email-hint" className="text-sm text-muted-foreground">
          Na ten adres otrzymasz odpowiedź.
        </p>
      )}
    </div>
  );
}
