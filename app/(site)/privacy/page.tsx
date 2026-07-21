import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka prywatności – CodeBucket",
};

const LAST_UPDATED = "21 lipca 2026 r.";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-lg font-medium tracking-tight sm:text-xl">
        {title}
      </h2>
      <div className="flex flex-col gap-2 text-sm sm:text-base">{children}</div>
    </section>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-1 list-disc pl-5">{children}</ul>;
}

function Li({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-medium text-foreground">{children}</strong>;
}

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto flex w-[90vw] max-w-7xl flex-1 flex-col pt-8 pb-24 sm:pt-16 sm:pb-32">
      <div className="flex flex-col gap-12 max-w-3xl">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Polityka prywatności
          </h1>
          <p className="text-sm text-muted-foreground">
            Ostatnia aktualizacja: {LAST_UPDATED}
          </p>
          <p className="text-sm sm:text-base">
            Niniejsza polityka prywatności opisuje, w jaki sposób przetwarzamy
            dane osobowe użytkowników serwisu CodeBucket (
            <span className="font-medium text-foreground">codebucket.pl</span>
            ). Prosimy o uważne zapoznanie się z jej treścią.
          </p>
        </div>

        {/* 1 */}
        <Section id="administrator" title="1. Administrator danych osobowych">
          <p>Administratorem Twoich danych osobowych jest:</p>
          <Card>
            <CardContent>
              <address className="not-italic">
                <strong>Oskar Goczał</strong>
                <br />
                E-mail:{" "}
                <a
                  href="mailto:kontakt@codebucket.pl"
                  className="underline underline-offset-2 decoration-accent hover:no-underline"
                >
                  kontakt@codebucket.pl
                </a>
              </address>
            </CardContent>
          </Card>
          <p>
            We wszelkich sprawach związanych z ochroną danych osobowych możesz
            kontaktować się pod adresem e-mail wskazanym powyżej.
          </p>
        </Section>

        {/* 2 */}
        <Section id="zakres-danych" title="2. Zakres przetwarzanych danych">
          <p>
            W zależności od sposobu korzystania z serwisu przetwarzamy
            następujące kategorie danych:
          </p>
          <Ul>
            <Li>
              <Strong>Dane konta:</Strong> adres e-mail, data założenia i
              ostatniej aktualizacji konta.
            </Li>
            <Li>
              <Strong>Dane postępów w nauce:</Strong> informacje o ukończonych
              sekcjach i elementach kursów, odblokowanych i ukończonych kursach,
              aktualnie realizowanym kursie.
            </Li>
            <Li>
              <Strong>Dane zamówień:</Strong> identyfikator użytkownika,
              zakupione kursy, kwota zamówienia, status płatności. Dane
              płatnicze (w tym dane karty) są przetwarzane wyłącznie przez
              Paddle jako Merchant of Record – my przechowujemy jedynie rekord
              zamówienia powiązany z kontem.
            </Li>
            <Li>
              <Strong>Preferencje interfejsu:</Strong> wybrany motyw
              kolorystyczny (jasny/ciemny).
            </Li>
            <Li>
              <Strong>Dane techniczne sesji:</Strong> dane zapisywane w
              zaszyfrowanym pliku cookie sesji (iron-session) niezbędne do
              utrzymania zalogowanego stanu.
            </Li>
          </Ul>
          <p>
            Nie przetwarzamy szczególnych kategorii danych osobowych (tzw.
            danych wrażliwych) w rozumieniu art. 9 RODO.
          </p>
        </Section>

        {/* 3 */}
        <Section
          id="cele-podstawy"
          title="3. Cele i podstawy prawne przetwarzania"
        >
          <p>
            Twoje dane przetwarzamy w następujących celach i na następujących
            podstawach prawnych:
          </p>
          <Ul>
            <Li>
              <Strong>Zawarcie i wykonanie umowy</Strong> (art. 6 ust. 1 lit. b
              RODO) – założenie i prowadzenie konta użytkownika, udostępnianie
              zakupionych kursów, śledzenie postępów w nauce.
            </Li>
            <Li>
              <Strong>Wykonanie obowiązku prawnego</Strong> (art. 6 ust. 1 lit.
              c RODO) – przechowywanie dokumentacji zamówień i płatności przez
              okres wymagany przepisami prawa (m.in. przepisy podatkowe i
              rachunkowe).
            </Li>
            <Li>
              <Strong>Uzasadniony interes administratora</Strong> (art. 6 ust. 1
              lit. f RODO) – zapewnienie bezpieczeństwa serwisu, wykrywanie
              nadużyć, wysyłka e-maili transakcyjnych związanych z
              funkcjonowaniem konta (np. resetowanie hasła).
            </Li>
          </Ul>
        </Section>

        {/* 4 */}
        <Section
          id="odbiorcy"
          title="4. Odbiorcy danych i podmioty przetwarzające"
        >
          <p>
            Twoje dane mogą być udostępniane następującym kategoriom odbiorców:
          </p>
          <Ul>
            <Li>
              <Strong>Google LLC / Google Cloud</Strong> (podmiot przetwarzający
              na podstawie umowy powierzenia) – hosting aplikacji (Firebase
              Hosting), uwierzytelnianie (Firebase Authentication), baza danych
              (Cloud Firestore). Polityka prywatności Google:{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 decoration-accent hover:no-underline"
              >
                policies.google.com/privacy
              </a>
              .
            </Li>
            <Li>
              <Strong>Resend Inc.</Strong> (podmiot przetwarzający na podstawie
              umowy powierzenia) – usługa wysyłki e-maili transakcyjnych
              (resetowanie hasła, powiadomienia systemowe).
            </Li>
            <Li>
              <Strong>Dostawca Redis</Strong> (podmiot przetwarzający na
              podstawie umowy powierzenia) – przechowywanie danych sesji i
              cache.
            </Li>
            <Li>
              <Strong>Paddle.com Market Limited</Strong> (30 Old Bailey, London,
              EC4M 7AU, Wielka Brytania) –{" "}
              <strong className="font-medium text-foreground">
                odrębny administrator danych
              </strong>{" "}
              w zakresie transakcji zakupu. Paddle pełni rolę Merchant of Record
              (autoryzowanego sprzedawcy) i przetwarza dane niezbędne do
              realizacji płatności, wystawienia dokumentów sprzedaży, obsługi
              zwrotów oraz rozliczenia VAT. Przetwarzanie danych przez Paddle
              odbywa się na podstawie{" "}
              <a
                href="https://www.paddle.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 decoration-accent hover:no-underline"
              >
                Polityki prywatności Paddle
              </a>
              , której Paddle jest jedynym administratorem – nie mamy wpływu na
              zasady przetwarzania danych przez Paddle.
            </Li>
          </Ul>
          <p>
            Nie sprzedajemy Twoich danych osobowych ani nie udostępniamy ich
            podmiotom trzecim w celach marketingowych bez Twojej zgody.
          </p>
        </Section>

        {/* 5 */}
        <Section id="transfer-eog" title="5. Przekazywanie danych poza EOG">
          <p>
            Część podmiotów przetwarzających (Google LLC, Resend Inc.) ma
            siedzibę w Stanach Zjednoczonych, co oznacza przekazywanie danych
            poza Europejski Obszar Gospodarczy (EOG). Przekazanie odbywa się na
            podstawie{" "}
            <Strong>
              standardowych klauzul umownych (SCC) zatwierdzonych przez Komisję
              Europejską
            </Strong>{" "}
            zgodnie z art. 46 ust. 2 lit. c RODO, co zapewnia odpowiedni poziom
            ochrony danych.
          </p>
          <p>
            <Strong>Paddle.com Market Limited</Strong> ma siedzibę w Wielkiej
            Brytanii. Przekazywanie danych do Wielkiej Brytanii odbywa się na
            podstawie{" "}
            <Strong>
              decyzji Komisji Europejskiej o adekwatności ochrony danych (art.
              45 RODO)
            </Strong>
            , stwierdzającej, że Wielka Brytania zapewnia odpowiedni poziom
            ochrony danych osobowych. Przetwarzanie danych przez Paddle jako
            odrębnego administratora odbywa się na zasadach opisanych w jego{" "}
            <a
              href="https://www.paddle.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 decoration-accent hover:no-underline"
            >
              Polityce prywatności
            </a>
            .
          </p>
          <p>
            Możesz uzyskać kopię dokumentów dotyczących zabezpieczeń stosowanych
            przez nas wobec podmiotów z USA, pisząc na adres{" "}
            <a
              href="mailto:kontakt@codebucket.pl"
              className="underline underline-offset-2 decoration-accent hover:no-underline"
            >
              kontakt@codebucket.pl
            </a>
            .
          </p>
        </Section>

        {/* 6 */}
        <Section
          id="okres-przechowywania"
          title="6. Okres przechowywania danych"
        >
          <Ul>
            <Li>
              <Strong>Dane konta i postępów:</Strong> do czasu usunięcia konta
              przez użytkownika lub przez administratora na wniosek, jednak nie
              dłużej niż 3 lata od ostatniej aktywności.
            </Li>
            <Li>
              <Strong>Dane zamówień i płatności:</Strong> przez 5 lat od końca
              roku podatkowego, w którym dokonano transakcji (obowiązek
              wynikający z przepisów podatkowych).
            </Li>
            <Li>
              <Strong>Logi bezpieczeństwa:</Strong> do 12 miesięcy.
            </Li>
            <Li>
              <Strong>Dane sesji (cookie):</Strong> do wylogowania lub
              wygaśnięcia sesji (maksymalnie 30 dni).
            </Li>
          </Ul>
          <p>
            Po upływie okresu przechowywania dane są trwale usuwane lub
            anonimizowane.
          </p>
        </Section>

        {/* 7 */}
        <Section id="prawa" title="7. Twoje prawa">
          <p>
            Na podstawie RODO przysługują Ci następujące prawa dotyczące Twoich
            danych osobowych:
          </p>
          <Ul>
            <Li>
              <Strong>Prawo dostępu</Strong> (art. 15 RODO) – prawo do uzyskania
              informacji o tym, jakie dane przetwarzamy, oraz do otrzymania ich
              kopii.
            </Li>
            <Li>
              <Strong>Prawo do sprostowania</Strong> (art. 16 RODO) – prawo do
              poprawy nieprawidłowych lub uzupełnienia niekompletnych danych.
            </Li>
            <Li>
              <Strong>Prawo do usunięcia</Strong> (art. 17 RODO) – prawo do
              żądania usunięcia danych („prawo do bycia zapomnianym"), o ile nie
              istnieje podstawa prawna zobowiązująca do ich dalszego
              przetwarzania.
            </Li>
            <Li>
              <Strong>Prawo do ograniczenia przetwarzania</Strong> (art. 18
              RODO) – prawo do żądania, by dane były jedynie przechowywane, bez
              ich dalszego przetwarzania.
            </Li>
            <Li>
              <Strong>Prawo do przenoszenia danych</Strong> (art. 20 RODO) –
              prawo do otrzymania swoich danych w ustrukturyzowanym, nadającym
              się do odczytu maszynowego formacie.
            </Li>
            <Li>
              <Strong>Prawo do sprzeciwu</Strong> (art. 21 RODO) – prawo do
              wniesienia sprzeciwu wobec przetwarzania opartego na uzasadnionym
              interesie administratora.
            </Li>
          </Ul>
          <p>
            Aby skorzystać z powyższych praw, napisz na adres{" "}
            <a
              href="mailto:kontakt@codebucket.pl"
              className="underline underline-offset-2 decoration-accent hover:no-underline"
            >
              kontakt@codebucket.pl
            </a>
            . Rozpatrzymy Twoje żądanie w ciągu 30 dni.
          </p>
        </Section>

        {/* 8 */}
        <Section id="uodo" title="8. Prawo skargi do organu nadzorczego">
          <p>
            Masz prawo wnieść skargę do{" "}
            <Strong>Prezesa Urzędu Ochrony Danych Osobowych (UODO)</Strong>,
            jeśli uważasz, że przetwarzanie Twoich danych osobowych narusza
            przepisy RODO.
          </p>
          <p>Dane kontaktowe UODO:</p>
          <address className="not-italic text-sm text-foreground">
            Urząd Ochrony Danych Osobowych
            <br />
            ul. Stawki 2, 00-193 Warszawa
            <br />
            Telefon: 606 950 000
            <br />
            E-mail:{" "}
            <a
              href="mailto:kancelaria@uodo.gov.pl"
              className="underline underline-offset-2 decoration-accent hover:no-underline"
            >
              kancelaria@uodo.gov.pl
            </a>
            <br />
            Strona:{" "}
            <a
              href="https://uodo.gov.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 decoration-accent hover:no-underline"
            >
              uodo.gov.pl
            </a>
          </address>
        </Section>

        {/* 9 */}
        <Section id="cookies" title="9. Pliki cookies">
          <p>Serwis korzysta z następujących plików cookies:</p>
          <Ul>
            <Li>
              <Strong>Cookie sesji (sesyjne):</Strong> zaszyfrowany plik cookie{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                session
              </code>{" "}
              zapisywany przez bibliotekę iron-session. Niezbędny do utrzymania
              stanu zalogowanego użytkownika. Ważny do momentu wylogowania lub
              przez maksymalnie 30 dni.
            </Li>
            <Li>
              <Strong>Cookie preferencji motywu (funkcjonalne):</Strong> plik
              cookie zapisujący wybór jasnego lub ciemnego motywu interfejsu.
              Przechowywany lokalnie bez przekazywania danych do serwerów
              zewnętrznych.
            </Li>
          </Ul>
          <p>
            Nie stosujemy plików cookies śledzących, marketingowych ani
            analitycznych.
          </p>
          <p>
            Możesz zarządzać plikami cookies poprzez ustawienia swojej
            przeglądarki, jednak wyłączenie cookie sesji uniemożliwi korzystanie
            z konta użytkownika.
          </p>
        </Section>

        {/* 10 */}
        <Section
          id="profilowanie"
          title="10. Zautomatyzowane decyzje i profilowanie"
        >
          <p>
            Nie stosujemy zautomatyzowanego podejmowania decyzji ani
            profilowania w rozumieniu art. 22 RODO. Żadne decyzje wywołujące
            skutki prawne lub istotnie wpływające na użytkowników nie są
            podejmowane automatycznie.
          </p>
        </Section>

        {/* 11 */}
        <Section id="dobrowolnosc" title="11. Dobrowolność podania danych">
          <p>
            Podanie danych osobowych jest dobrowolne, lecz konieczne do
            korzystania z serwisu. Bez adresu e-mail i danych niezbędnych do
            zawarcia umowy nie jest możliwe założenie konta ani zakup kursu.
          </p>
        </Section>

        {/* 12 */}
        <Section id="zmiany" title="12. Zmiany polityki prywatności">
          <p>
            Zastrzegamy sobie prawo do zmiany niniejszej polityki prywatności. O
            wszelkich istotnych zmianach poinformujemy poprzez e-mail na adres
            powiązany z Twoim kontem lub komunikat w serwisie, z wyprzedzeniem
            co najmniej 14 dni.
          </p>
          <p>
            Aktualna wersja polityki jest zawsze dostępna pod adresem{" "}
            <span className="font-medium text-foreground">
              codebucket.pl/privacy
            </span>
            .
          </p>
        </Section>
      </div>
    </main>
  );
}
