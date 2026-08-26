import { z } from "zod";

export const MAX_ATTACHMENTS = 3;
export const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;
export const MAX_CONTACT_PER_DAY = 3;

export const CONTACT_REASONS = [
  {
    value: "bug",
    label: "Problem techniczny",
    email: "pomoc@codebucket.pl",
    thankYouMessage:
      "Dziękujemy za pomoc w dopracowaniu aplikacji. Skontaktujemy się z Tobą po rozpatrzeniu zgłoszenia.",
  },
  {
    value: "content-error",
    label: "Błąd w treści kursu",
    email: "pomoc@codebucket.pl",
    thankYouMessage:
      "Dziękujemy za pomoc w rozwoju naszych kursów. Przyjrzymy się sprawie najszybciej jak to możliwe.",
  },
  {
    value: "suggestion",
    label: "Sugestia",
    email: "sugestie@codebucket.pl",
    thankYouMessage:
      "Dziękujemy za pomoc w rozwoju platformy. Sugestie mają realny wpływ na kierunek rozwoju platformy.",
  },
  {
    value: "other",
    label: "Inny",
    email: "kontakt@codebucket.pl",
    thankYouMessage:
      "Dziękujemy za wiadomość. Odpowiemy najszybciej, jak to możliwe.",
  },
] as const;

export type ContactReasonValue = (typeof CONTACT_REASONS)[number]["value"];
export type ContactReason = (typeof CONTACT_REASONS)[number];

const CONTACT_REASON_VALUES = CONTACT_REASONS.map((reason) => reason.value) as [
  ContactReasonValue,
  ...ContactReasonValue[],
];

export const DEFAULT_THANK_YOU_MESSAGE =
  CONTACT_REASONS[CONTACT_REASONS.length - 1].thankYouMessage;

export const contactInputSchema = z.object({
  reason: z.enum(CONTACT_REASON_VALUES, {
    error: "Wybierz powód zgłoszenia.",
  }),
  email: z.string().email("Podaj prawidłowy adres email."),
  message: z
    .string()
    .trim()
    .min(14, "Treść zgłoszenia musi mieć co najmniej 14 znaków.")
    .max(5000, "Treść zgłoszenia jest zbyt długa."),
});

export type ContactInput = z.infer<typeof contactInputSchema>;

export function getContactReason(
  value: string | undefined,
): ContactReason | undefined {
  return CONTACT_REASONS.find((reason) => reason.value === value);
}
