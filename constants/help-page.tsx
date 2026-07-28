import type { HelpFaqItem } from "@/components/help/HelpFaq";
import { HelpPaymentMethods } from "@/components/help/HelpPaymentMethods";
import { LegalLink, LegalListItem, LegalOrderedList } from "@/components/legal";

export const SUPPORT_EMAIL = "pomoc@codebucket.pl";
export const SUGGESTIONS_EMAIL = "sugestie@codebucket.pl";
export const GENERAL_EMAIL = "kontakt@codebucket.pl";

export const CONTACT_CHANNELS = [
  {
    title: "Błędy i problemy techniczne",
    description:
      "Masz problem z działaniem platformy, kursem lub znalazłeś błąd?",
    email: SUPPORT_EMAIL,
  },
  {
    title: "Sugestie nowych funkcji i zmian",
    description:
      "Masz pomysł, jak możemy ulepszyć CodeBucket? Chcesz zaproponować nową funkcję lub zmianę?",
    email: SUGGESTIONS_EMAIL,
  },
  {
    title: "Pozostałe sprawy",
    description: "Pytania dotyczące współpracy, kursów lub inne wiadomości.",
    email: GENERAL_EMAIL,
  },
] as const;

export const PAYMENT_METHODS = [
  {
    label: "BLIK",
    logos: [{ src: "/payment-methods/blik-logo.png", alt: "BLIK" }],
  },
  {
    label: "Google Pay",
    logos: [{ src: "/payment-methods/google-pay.png", alt: "Google Pay" }],
  },
  {
    label: "Apple Pay",
    logos: [{ src: "/payment-methods/apple-pay.svg", alt: "Apple Pay" }],
  },
  {
    label: "PayPal",
    logos: [{ src: "/payment-methods/paypal.png", alt: "PayPal" }],
  },
  {
    label: "karty płatniczej Visa/Mastercard",
    logos: [
      { src: "/payment-methods/visa.webp", alt: "Visa" },
      { src: "/payment-methods/mastercard.svg", alt: "Mastercard" },
    ],
  },
] as const;

export const FAQ_ITEMS: HelpFaqItem[] = [
  {
    question: "Nie mogę się zalogować — co zrobić?",
    answer: (
      <>
        <p>
          Sprawdź, czy wpisujesz poprawny adres e-mail oraz hasło. Jeśli nadal
          nie możesz się zalogować, skorzystaj z opcji{" "}
          <LegalLink href="/reset-password">resetowania hasła</LegalLink>.
        </p>
        <p>
          Jeżeli problem nadal występuje, napisz do nas na adres{" "}
          <LegalLink href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </LegalLink>
          .
        </p>
      </>
    ),
  },
  {
    question: "Jakie metody płatności są dostępne?",
    answer: (
      <>
        <p>
          Płatności są obsługiwane przez{" "}
          <LegalLink href="https://www.paddle.com" external target="_blank">
            Paddle
          </LegalLink>
          . Aktualnie możesz zapłacić za pomocą:
        </p>
        <HelpPaymentMethods />
      </>
    ),
  },
  {
    question: "Czy mogę otrzymać fakturę VAT?",
    answer: (
      <>
        <p>
          Tak. Po zakupie możesz otrzymać fakturę VAT wystawioną przez Paddle —
          operatora obsługującego płatności za kursy.
        </p>
        <p>
          Aby otrzymać fakturę na firmę, podczas zakupu podaj dane firmy oraz
          numer VAT/NIP. Dokument zostanie przesłany na adres e-mail podany
          podczas płatności.
        </p>
      </>
    ),
  },
  {
    question: "Czy dostęp do kursu jest bezterminowy?",
    answer: (
      <>
        <p>
          Tak. Po zakupie kursu otrzymujesz bezterminowy dostęp do jego
          zawartości.
        </p>
        <p>
          Nie musisz kończyć kursu w określonym czasie — możesz wracać do
          materiałów kiedy chcesz.
        </p>
      </>
    ),
  },
  {
    question: "Na ilu urządzeniach mogę korzystać z kursu?",
    answer: (
      <>
        <p>Możesz korzystać z kursu na dowolnej liczbie własnych urządzeń.</p>
        <p>Wystarczy zalogować się na swoje konto CodeBucket.</p>
      </>
    ),
  },
  {
    question: "Czy kurs działa na telefonie?",
    answer: (
      <>
        <p>Tak. Platforma jest dostosowana do urządzeń mobilnych.</p>
        <p>
          Najlepsze doświadczenie nauki uzyskasz jednak na komputerze,
          szczególnie podczas wykonywania ćwiczeń z kodowaniem.
        </p>
      </>
    ),
  },
  {
    question: "Nie otrzymałem dostępu do kursu po zakupie — co zrobić?",
    answer: (
      <>
        <p>
          Dostęp do kursu powinien zostać nadany automatycznie po poprawnym
          zakończeniu płatności. Sprawdź, czy otrzymałeś e-mail z potwierdzeniem
          płatności i czy środki zostały pobrane z Twojego konta. Jeśli nie —
          spróbuj ponowić zakup.
        </p>
        <p>
          Jeżeli płatność przebiegła prawidłowo i nadal nie widzisz zakupionego
          kursu:
        </p>
        <LegalOrderedList>
          <LegalListItem>Odśwież stronę.</LegalListItem>
          <LegalListItem>
            Otwórz „Twoje konto” w nagłówku strony i sprawdź, czy zakupiony kurs
            znajduje się na liście „Twoje kursy”.
          </LegalListItem>
          <LegalListItem>
            Jeżeli problem nadal występuje, napisz do nas na{" "}
            <LegalLink href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </LegalLink>
            .
          </LegalListItem>
        </LegalOrderedList>
      </>
    ),
  },
];

export const PRESALE_FAQ_ITEMS: HelpFaqItem[] = [
  {
    question: "Co jeśli premiera kursu się opóźni?",
    answer:
      "Jeśli termin premiery ulegnie zmianie, poinformujemy Cię o tym mailowo. W każdej chwili możesz zrezygnować z zakupu i otrzymać pełny zwrot wpłaty.",
  },
  {
    question: "Co jeśli kurs mi się nie spodoba?",
    answer:
      "Masz 30 dni od premiery pełnej wersji kursu, aby poprosić o pełny zwrot wpłaty. Nie musisz podawać przyczyny.",
  },
  {
    question: "Jak mogę uzyskać zwrot wpłaty?",
    answer:
      "Wystarczy wypełnić krótki formularz dostępny po zakupie kursu. Zwrot środków zostanie zrealizowany tą samą metodą płatności.",
  },
  {
    question: "Czy po zakupie otrzymam dostęp do przyszłych aktualizacji?",
    answer:
      "Tak. Kupując kurs w przedsprzedaży otrzymujesz bezterminowy dostęp do kursu oraz wszystkich przyszłych aktualizacji bez dodatkowych opłat.",
  },
  {
    question: "Czy dostęp do kursu jest ograniczony czasowo?",
    answer: "Nie. Dostęp do kursu jest bezterminowy.",
  },
];
