import { z } from "zod";

export const newsletterSubscribeInputSchema = z.object({
  email: z.string().email("Podaj prawidłowy adres email."),
});

export const newsletterSubscriberSchema = z.object({
  email: z.string().email(),
  createdAt: z.date(),
  source: z.string().min(1),
});

export type NewsletterSubscribeInput = z.infer<
  typeof newsletterSubscribeInputSchema
>;
export type NewsletterSubscriber = z.infer<typeof newsletterSubscriberSchema>;
