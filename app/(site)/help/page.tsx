import type { Metadata } from "next";

import { HelpContactCard } from "@/components/help/HelpContactCard";
import { HelpFaq } from "@/components/help/HelpFaq";
import { HelpPaymentMethods } from "@/components/help/HelpPaymentMethods";
import {
  LegalDocument,
  LegalHeader,
  LegalLink,
  LegalList,
  LegalListItem,
  LegalSection,
} from "@/components/legal";
import {
  CONTACT_CHANNELS,
  FAQ_ITEMS,
  PRESALE_FAQ_ITEMS,
} from "@/constants/help-page";

export const metadata: Metadata = {
  title: "Pomoc i kontakt – CodeBucket",
  description:
    "Odpowiedzi na najczęstsze pytania o kursy, płatności i działanie platformy CodeBucket oraz adresy kontaktowe.",
};

export default function HelpAndContactPage() {
  return (
    <LegalDocument>
      <LegalHeader title="Pomoc i kontakt">
        <p className="text-sm sm:text-base">
          Masz pytanie dotyczące kursów, płatności lub działania platformy?
          Sprawdź najczęściej zadawane pytania albo skontaktuj się z nami.
        </p>
      </LegalHeader>

      <LegalSection id="kontakt" title="Kontakt">
        <div className="flex flex-col gap-3">
          {CONTACT_CHANNELS.map((channel) => (
            <HelpContactCard
              key={channel.email}
              title={channel.title}
              description={channel.description}
              email={channel.email}
            />
          ))}
        </div>
      </LegalSection>

      <LegalSection id="faq" title="Najczęściej zadawane pytania">
        <HelpFaq items={FAQ_ITEMS} />
      </LegalSection>

      <LegalSection id="przedsprzedaz" title="Zakup w przedsprzedaży">
        <HelpFaq items={PRESALE_FAQ_ITEMS} />
      </LegalSection>

      <LegalSection id="platnosci" title="Płatności">
        <p>
          Płatności za kursy są obsługiwane przez{" "}
          <LegalLink href="https://www.paddle.com" external target="_blank">
            Paddle
          </LegalLink>{" "}
          — globalną platformę do obsługi płatności cyfrowych. Paddle odpowiada
          za bezpieczne przetwarzanie płatności, obsługę transakcji oraz
          związane z nimi kwestie rozliczeniowe.
        </p>
        <p>
          Dane karty płatniczej oraz inne poufne informacje dotyczące płatności
          są przetwarzane przez Paddle i nie są przechowywane przez CodeBucket.
        </p>
        <p>
          Do transakcji sprzedaży zastosowanie mają{" "}
          <LegalLink
            href="https://www.paddle.com/legal/buyer-terms"
            external
            target="_blank"
          >
            Warunki Kupującego Paddle
          </LegalLink>
          .
        </p>
        <p>Za kurs możesz zapłacić korzystając z:</p>
        <HelpPaymentMethods />
      </LegalSection>

      <LegalSection id="pozostale-informacje" title="Pozostałe informacje">
        <LegalList>
          <LegalListItem>
            <LegalLink href="/terms">Regulamin</LegalLink>
          </LegalListItem>
          <LegalListItem>
            <LegalLink href="/privacy">Polityka prywatności</LegalLink>
          </LegalListItem>
        </LegalList>
      </LegalSection>
    </LegalDocument>
  );
}
