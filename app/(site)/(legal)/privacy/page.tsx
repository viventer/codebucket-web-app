import {
  LegalContactCard,
  LegalDocument,
  LegalEmph,
  LegalHeader,
  LegalLink,
  LegalList,
  LegalListItem,
  LegalSection,
  LegalStrong,
} from "@/components/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka prywatności – CodeBucket",
};

const LAST_UPDATED = "21 lipca 2026 r.";

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument>
      <LegalHeader title="Polityka prywatności" lastUpdated={LAST_UPDATED}>
        <p className="text-sm sm:text-base">
          Niniejsza polityka prywatności opisuje, w jaki sposób przetwarzamy
          dane osobowe użytkowników serwisu CodeBucket (
          <LegalEmph>codebucket.pl</LegalEmph>
          ). Prosimy o uważne zapoznanie się z jej treścią.
        </p>
      </LegalHeader>

      {/* 1 */}
      <LegalSection
        id="administrator"
        title="1. Administrator danych osobowych"
      >
        <p>Administratorem Twoich danych osobowych jest:</p>
        <LegalContactCard />
        <p>
          We wszelkich sprawach związanych z ochroną danych osobowych możesz
          kontaktować się pod adresem e-mail wskazanym powyżej.
        </p>
      </LegalSection>

      {/* 2 */}
      <LegalSection id="zakres-danych" title="2. Zakres przetwarzanych danych">
        <p>
          W zależności od sposobu korzystania z serwisu przetwarzamy następujące
          kategorie danych:
        </p>
        <LegalList>
          <LegalListItem>
            <LegalStrong>Dane konta:</LegalStrong> adres e-mail, data założenia
            i ostatniej aktualizacji konta.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Dane postępów w nauce:</LegalStrong> informacje o
            ukończonych sekcjach i elementach kursów, odblokowanych i
            ukończonych kursach, aktualnie realizowanym kursie.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Dane zamówień:</LegalStrong> identyfikator użytkownika,
            zakupione kursy, kwota zamówienia, status płatności. Dane płatnicze
            (w tym dane karty) są przetwarzane wyłącznie przez Paddle jako
            Merchant of Record – my przechowujemy jedynie rekord zamówienia
            powiązany z kontem.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Preferencje interfejsu:</LegalStrong> wybrany motyw
            kolorystyczny (jasny/ciemny).
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Dane techniczne sesji:</LegalStrong> dane zapisywane w
            zaszyfrowanym pliku cookie sesji (iron-session) niezbędne do
            utrzymania zalogowanego stanu.
          </LegalListItem>
        </LegalList>
        <p>
          Nie przetwarzamy szczególnych kategorii danych osobowych (tzw. danych
          wrażliwych) w rozumieniu art. 9 RODO.
        </p>
      </LegalSection>

      {/* 3 */}
      <LegalSection
        id="cele-podstawy"
        title="3. Cele i podstawy prawne przetwarzania"
      >
        <p>
          Twoje dane przetwarzamy w następujących celach i na następujących
          podstawach prawnych:
        </p>
        <LegalList>
          <LegalListItem>
            <LegalStrong>Zawarcie i wykonanie umowy</LegalStrong> (art. 6 ust. 1
            lit. b RODO) – założenie i prowadzenie konta użytkownika,
            udostępnianie zakupionych kursów, śledzenie postępów w nauce.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Wykonanie obowiązku prawnego</LegalStrong> (art. 6 ust.
            1 lit. c RODO) – przechowywanie dokumentacji zamówień i płatności
            przez okres wymagany przepisami prawa (m.in. przepisy podatkowe i
            rachunkowe).
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Uzasadniony interes administratora</LegalStrong> (art.
            6 ust. 1 lit. f RODO) – zapewnienie bezpieczeństwa serwisu,
            wykrywanie nadużyć, wysyłka e-maili transakcyjnych związanych z
            funkcjonowaniem konta (np. resetowanie hasła).
          </LegalListItem>
        </LegalList>
      </LegalSection>

      {/* 4 */}
      <LegalSection
        id="odbiorcy"
        title="4. Odbiorcy danych i podmioty przetwarzające"
      >
        <p>
          Twoje dane mogą być udostępniane następującym kategoriom odbiorców:
        </p>
        <LegalList>
          <LegalListItem>
            <LegalStrong>Google LLC / Google Cloud</LegalStrong> (podmiot
            przetwarzający na podstawie umowy powierzenia) – hosting aplikacji
            (Firebase Hosting), uwierzytelnianie (Firebase Authentication), baza
            danych (Cloud Firestore). Polityka prywatności Google:{" "}
            <LegalLink href="https://policies.google.com/privacy" external>
              policies.google.com/privacy
            </LegalLink>
            .
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Resend Inc.</LegalStrong> (podmiot przetwarzający na
            podstawie umowy powierzenia) – usługa wysyłki e-maili transakcyjnych
            (resetowanie hasła, powiadomienia systemowe).
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Dostawca Redis</LegalStrong> (podmiot przetwarzający na
            podstawie umowy powierzenia) – przechowywanie danych sesji i cache.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Paddle.com Market Limited</LegalStrong> (30 Old Bailey,
            London, EC4M 7AU, Wielka Brytania) –{" "}
            <LegalStrong>odrębny administrator danych</LegalStrong> w zakresie
            transakcji zakupu. Paddle pełni rolę Merchant of Record
            (autoryzowanego sprzedawcy) i przetwarza dane niezbędne do
            realizacji płatności, wystawienia dokumentów sprzedaży, obsługi
            zwrotów oraz rozliczenia VAT. Przetwarzanie danych przez Paddle
            odbywa się na podstawie{" "}
            <LegalLink href="https://www.paddle.com/legal/privacy" external>
              Polityki prywatności Paddle
            </LegalLink>
            , której Paddle jest jedynym administratorem – nie mamy wpływu na
            zasady przetwarzania danych przez Paddle.
          </LegalListItem>
        </LegalList>
        <p>
          Nie sprzedajemy Twoich danych osobowych ani nie udostępniamy ich
          podmiotom trzecim w celach marketingowych bez Twojej zgody.
        </p>
      </LegalSection>

      {/* 5 */}
      <LegalSection id="transfer-eog" title="5. Przekazywanie danych poza EOG">
        <p>
          Część podmiotów przetwarzających (Google LLC, Resend Inc.) ma siedzibę
          w Stanach Zjednoczonych, co oznacza przekazywanie danych poza
          Europejski Obszar Gospodarczy (EOG). Przekazanie odbywa się na
          podstawie{" "}
          <LegalStrong>
            standardowych klauzul umownych (SCC) zatwierdzonych przez Komisję
            Europejską
          </LegalStrong>{" "}
          zgodnie z art. 46 ust. 2 lit. c RODO, co zapewnia odpowiedni poziom
          ochrony danych.
        </p>
        <p>
          <LegalStrong>Paddle.com Market Limited</LegalStrong> ma siedzibę w
          Wielkiej Brytanii. Przekazywanie danych do Wielkiej Brytanii odbywa
          się na podstawie{" "}
          <LegalStrong>
            decyzji Komisji Europejskiej o adekwatności ochrony danych (art. 45
            RODO)
          </LegalStrong>
          , stwierdzającej, że Wielka Brytania zapewnia odpowiedni poziom
          ochrony danych osobowych. Przetwarzanie danych przez Paddle jako
          odrębnego administratora odbywa się na zasadach opisanych w jego{" "}
          <LegalLink href="https://www.paddle.com/legal/privacy" external>
            Polityce prywatności
          </LegalLink>
          .
        </p>
        <p>
          Możesz uzyskać kopię dokumentów dotyczących zabezpieczeń stosowanych
          przez nas wobec podmiotów z USA, pisząc na adres{" "}
          <LegalLink href="mailto:kontakt@codebucket.pl">
            kontakt@codebucket.pl
          </LegalLink>
          .
        </p>
      </LegalSection>

      {/* 6 */}
      <LegalSection
        id="okres-przechowywania"
        title="6. Okres przechowywania danych"
      >
        <LegalList>
          <LegalListItem>
            <LegalStrong>Dane konta i postępów:</LegalStrong> do czasu usunięcia
            konta przez użytkownika lub przez administratora na wniosek, jednak
            nie dłużej niż 3 lata od ostatniej aktywności.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Dane zamówień i płatności:</LegalStrong> przez 5 lat od
            końca roku podatkowego, w którym dokonano transakcji (obowiązek
            wynikający z przepisów podatkowych).
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Logi bezpieczeństwa:</LegalStrong> do 12 miesięcy.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Dane sesji (cookie):</LegalStrong> do wylogowania lub
            wygaśnięcia sesji (maksymalnie 30 dni).
          </LegalListItem>
        </LegalList>
        <p>
          Po upływie okresu przechowywania dane są trwale usuwane lub
          anonimizowane.
        </p>
      </LegalSection>

      {/* 7 */}
      <LegalSection id="prawa" title="7. Twoje prawa">
        <p>
          Na podstawie RODO przysługują Ci następujące prawa dotyczące Twoich
          danych osobowych:
        </p>
        <LegalList>
          <LegalListItem>
            <LegalStrong>Prawo dostępu</LegalStrong> (art. 15 RODO) – prawo do
            uzyskania informacji o tym, jakie dane przetwarzamy, oraz do
            otrzymania ich kopii.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Prawo do sprostowania</LegalStrong> (art. 16 RODO) –
            prawo do poprawy nieprawidłowych lub uzupełnienia niekompletnych
            danych.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Prawo do usunięcia</LegalStrong> (art. 17 RODO) – prawo
            do żądania usunięcia danych („prawo do bycia zapomnianym"), o ile
            nie istnieje podstawa prawna zobowiązująca do ich dalszego
            przetwarzania.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Prawo do ograniczenia przetwarzania</LegalStrong> (art.
            18 RODO) – prawo do żądania, by dane były jedynie przechowywane, bez
            ich dalszego przetwarzania.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Prawo do przenoszenia danych</LegalStrong> (art. 20
            RODO) – prawo do otrzymania swoich danych w ustrukturyzowanym,
            nadającym się do odczytu maszynowego formacie.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Prawo do sprzeciwu</LegalStrong> (art. 21 RODO) – prawo
            do wniesienia sprzeciwu wobec przetwarzania opartego na uzasadnionym
            interesie administratora.
          </LegalListItem>
        </LegalList>
        <p>
          Aby skorzystać z powyższych praw, napisz na adres{" "}
          <LegalLink href="mailto:kontakt@codebucket.pl">
            kontakt@codebucket.pl
          </LegalLink>
          . Rozpatrzymy Twoje żądanie w ciągu 30 dni.
        </p>
      </LegalSection>

      {/* 8 */}
      <LegalSection id="uodo" title="8. Prawo skargi do organu nadzorczego">
        <p>
          Masz prawo wnieść skargę do{" "}
          <LegalStrong>
            Prezesa Urzędu Ochrony Danych Osobowych (UODO)
          </LegalStrong>
          , jeśli uważasz, że przetwarzanie Twoich danych osobowych narusza
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
          <LegalLink href="mailto:kancelaria@uodo.gov.pl">
            kancelaria@uodo.gov.pl
          </LegalLink>
          <br />
          Strona:{" "}
          <LegalLink href="https://uodo.gov.pl" external>
            uodo.gov.pl
          </LegalLink>
        </address>
      </LegalSection>

      {/* 9 */}
      <LegalSection id="cookies" title="9. Pliki cookies">
        <p>Serwis korzysta z następujących plików cookies:</p>
        <LegalList>
          <LegalListItem>
            <LegalStrong>Cookie sesji (sesyjne):</LegalStrong> zaszyfrowany plik
            cookie{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              session
            </code>{" "}
            zapisywany przez bibliotekę iron-session. Niezbędny do utrzymania
            stanu zalogowanego użytkownika. Ważny do momentu wylogowania lub
            przez maksymalnie 30 dni.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Cookie preferencji motywu (funkcjonalne):</LegalStrong>{" "}
            plik cookie zapisujący wybór jasnego lub ciemnego motywu interfejsu.
            Przechowywany lokalnie bez przekazywania danych do serwerów
            zewnętrznych.
          </LegalListItem>
        </LegalList>
        <p>
          Nie stosujemy plików cookies śledzących, marketingowych ani
          analitycznych.
        </p>
        <p>
          Możesz zarządzać plikami cookies poprzez ustawienia swojej
          przeglądarki, jednak wyłączenie cookie sesji uniemożliwi korzystanie z
          konta użytkownika.
        </p>
      </LegalSection>

      {/* 10 */}
      <LegalSection
        id="profilowanie"
        title="10. Zautomatyzowane decyzje i profilowanie"
      >
        <p>
          Nie stosujemy zautomatyzowanego podejmowania decyzji ani profilowania
          w rozumieniu art. 22 RODO. Żadne decyzje wywołujące skutki prawne lub
          istotnie wpływające na użytkowników nie są podejmowane automatycznie.
        </p>
      </LegalSection>

      {/* 11 */}
      <LegalSection id="dobrowolnosc" title="11. Dobrowolność podania danych">
        <p>
          Podanie danych osobowych jest dobrowolne, lecz konieczne do
          korzystania z serwisu. Bez adresu e-mail i danych niezbędnych do
          zawarcia umowy nie jest możliwe założenie konta ani zakup kursu.
        </p>
      </LegalSection>

      {/* 12 */}
      <LegalSection id="zmiany" title="12. Zmiany polityki prywatności">
        <p>
          Zastrzegamy sobie prawo do zmiany niniejszej polityki prywatności. O
          wszelkich istotnych zmianach poinformujemy poprzez e-mail na adres
          powiązany z Twoim kontem lub komunikat w serwisie, z wyprzedzeniem co
          najmniej 14 dni.
        </p>
        <p>
          Aktualna wersja polityki jest zawsze dostępna pod adresem{" "}
          <LegalEmph>codebucket.pl/privacy</LegalEmph>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
