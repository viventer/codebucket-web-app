"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContactFieldError } from "@/components/contact/ContactFieldError";
import { CONTACT_REASONS, type ContactReasonValue } from "@/schemas/contactSchema";

type ContactReasonFieldProps = {
  value: ContactReasonValue | undefined;
  error?: string;
  disabled: boolean;
  onChange: (value: ContactReasonValue) => void;
};

export function ContactReasonField({
  value,
  error,
  disabled,
  onChange,
}: ContactReasonFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="contact-reason">Powód zgłoszenia</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id="contact-reason"
          className="w-full"
          aria-invalid={!!error}
          aria-describedby={error ? "contact-reason-error" : undefined}
        >
          <SelectValue placeholder="Wybierz powód" />
        </SelectTrigger>
        <SelectContent position="popper">
          {CONTACT_REASONS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? (
        <ContactFieldError id="contact-reason-error">{error}</ContactFieldError>
      ) : null}
    </div>
  );
}
