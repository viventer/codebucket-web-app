import { MainContainer } from "@/components/MainContainer";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulamin – CodeBucket",
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

export default function TermsPage() {
  return (
    <MainContainer>
      <div className="flex flex-col gap-12 max-w-3xl">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Regulamin
          </h1>
          <p className="text-sm text-muted-foreground">
            Ostatnia aktualizacja: {LAST_UPDATED}
          </p>
          <p className="text-sm sm:text-base">
            Niniejszy regulamin określa zasady korzystania z serwisu CodeBucket
            dostępnego pod adresem{" "}
            <span className="font-medium text-foreground">codebucket.pl</span>.
            Prosimy o uważne zapoznanie się z jego treścią przed rozpoczęciem
            korzystania z serwisu.
          </p>
        </div>

        {/* 1 */}
        <Section id="definicje" title="1. Postanowienia ogólne i definicje">
          <p>Użyte w niniejszym regulaminie pojęcia oznaczają:</p>
          <Ul>
            <Li>
              <Strong>Usługodawca</Strong> – Oskar Goczał, prowadzący serwis
              CodeBucket pod adresem codebucket.pl; adres kontaktowy:{" "}
              <a
                href="mailto:kontakt@codebucket.pl"
                className="underline underline-offset-2 decoration-accent hover:no-underline"
              >
                kontakt@codebucket.pl
              </a>
              .
            </Li>
            <Li>
              <Strong>Sprzedawca / Merchant of Record</Strong> – Paddle.com
              Market Limited, spółka zarejestrowana w Anglii i Walii pod numerem
              8172165, z siedzibą pod adresem 30 Old Bailey, London, EC4M 7AU,
              Wielka Brytania. Paddle pełni rolę autoryzowanego sprzedawcy
              (resellera) kursów płatnych w serwisie i jest podmiotem
              odpowiedzialnym za przyjmowanie płatności, wystawianie dokumentów
              sprzedaży i rozliczanie podatku VAT.
            </Li>
            <Li>
              <Strong>Serwis</Strong> – platforma edukacyjna dostępna pod
              adresem codebucket.pl.
            </Li>
            <Li>
              <Strong>Użytkownik</Strong> – każda osoba fizyczna, która korzysta
              z serwisu.
            </Li>
            <Li>
              <Strong>Konsument</Strong> – Użytkownik będący osobą fizyczną
              dokonującą czynności prawnej niezwiązanej bezpośrednio z jej
              działalnością gospodarczą lub zawodową.
            </Li>
            <Li>
              <Strong>Konto</Strong> – indywidualne konto Użytkownika w serwisie
              utworzone po rejestracji.
            </Li>
            <Li>
              <Strong>Kurs</Strong> – zorganizowany materiał edukacyjny dostępny
              w serwisie, składający się z lekcji, ćwiczeń, quizów i projektów.
            </Li>
            <Li>
              <Strong>Treść cyfrowa</Strong> – kurs lub jego część w rozumieniu
              art. 2 pkt 5 dyrektywy 2019/770 (o dostarczaniu treści cyfrowych i
              usług cyfrowych).
            </Li>
            <Li>
              <Strong>Przedsprzedaż</Strong> – możliwość zakupu kursu przed datą
              jego oficjalnej premiery.
            </Li>
          </Ul>
          <p>
            Serwis jest prowadzony przez Usługodawcę, który jest autorem i
            dostawcą treści edukacyjnych. Sprzedaż kursów płatnych odbywa się za
            pośrednictwem Paddle jako Merchant of Record – to oznacza, że umowa
            sprzedaży kursu płatnego jest zawierana między Użytkownikiem a
            Paddle, a nie bezpośrednio z Usługodawcą.
          </p>
        </Section>

        {/* 2 */}
        <Section id="kontakt" title="2. Dane kontaktowe Usługodawcy">
          <p>
            W sprawach dotyczących działania serwisu, dostępu do treści i
            reklamacji merytorycznych możesz kontaktować się z Usługodawcą:
          </p>
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
        </Section>

        {/* 3 */}
        <Section id="wymagania" title="3. Wymagania techniczne">
          <p>Do korzystania z serwisu niezbędne są:</p>
          <Ul>
            <Li>
              urządzenie z dostępem do internetu i aktualną przeglądarką
              internetową obsługującą JavaScript (np. Chrome, Firefox, Edge,
              Safari w aktualnych wersjach),
            </Li>
            <Li>aktywny adres e-mail,</Li>
            <Li>
              włączona obsługa plików cookies (wymagana do utrzymania sesji
              zalogowanego użytkownika).
            </Li>
          </Ul>
          <p>
            Interaktywne ćwiczenia programistyczne działają w oparciu o edytor
            kodu Monaco osadzony w przeglądarce – nie wymaga instalacji
            dodatkowego oprogramowania.
          </p>
        </Section>

        {/* 4 */}
        <Section id="usługi" title="4. Rodzaje usług">
          <p>Serwis oferuje następujące rodzaje usług:</p>
          <Ul>
            <Li>
              <Strong>Usługi bezpłatne:</Strong> założenie i prowadzenie konta,
              dostęp do kursów oznaczonych jako darmowe, śledzenie postępów w
              nauce, dostęp do części demonstracyjnej kursów płatnych.
            </Li>
            <Li>
              <Strong>Usługi płatne:</Strong> dostęp do kursów płatnych.
            </Li>
          </Ul>
          <p>
            Szczegółowy zakres każdego kursu jest opisany na jego stronie w
            serwisie przed dokonaniem zakupu.
          </p>
        </Section>

        {/* 5 */}
        <Section id="konto" title="5. Rejestracja i konto">
          <p>
            Korzystanie z serwisu w pełnym zakresie wymaga założenia konta.
            Rejestracja odbywa się przez podanie adresu e-mail i hasła
            (uwierzytelnianie realizowane przez Firebase Authentication).
          </p>
          <p>Użytkownik zobowiązuje się do:</p>
          <Ul>
            <Li>podania prawdziwych danych podczas rejestracji,</Li>
            <Li>
              zachowania poufności danych logowania i nieudostępniania ich
              osobom trzecim,
            </Li>
            <Li>
              niezwłocznego powiadomienia Usługodawcy o nieautoryzowanym
              dostępie do konta.
            </Li>
          </Ul>
          <p>
            Usługodawca zastrzega sobie prawo do zawieszenia lub usunięcia konta
            w przypadku naruszenia niniejszego regulaminu. Użytkownik może w
            każdej chwili zażądać usunięcia konta, wysyłając wiadomość na adres{" "}
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
        <Section id="licencja" title="6. Licencja na treści">
          <p>
            Z chwilą uzyskania dostępu do kursu (bezpłatnego lub płatnego)
            Użytkownik otrzymuje niewyłączną, niezbywalną, nieprzenaszalną
            licencję na korzystanie z treści wyłącznie do własnych celów
            edukacyjnych.
          </p>
          <p>Licencja nie obejmuje w szczególności prawa do:</p>
          <Ul>
            <Li>
              kopiowania, powielania lub dystrybucji treści w całości ani w
              części,
            </Li>
            <Li>
              publicznego udostępniania treści osobom trzecim (w tym publikacji
              w serwisach streamingowych, mediach społecznościowych itp.),
            </Li>
            <Li>
              odsprzedaży, sublicencjonowania lub komercyjnego wykorzystania
              treści,
            </Li>
            <Li>
              tworzenia materiałów pochodnych opartych na treściach serwisu bez
              pisemnej zgody Usługodawcy.
            </Li>
          </Ul>
          <p>
            Wszelkie prawa własności intelektualnej do treści w serwisie
            pozostają własnością Usługodawcy lub podmiotów, które udzieliły mu
            stosownych licencji.
          </p>
        </Section>

        {/* 7 */}
        <Section id="platnosci" title="7. Zakup kursów płatnych i płatności">
          <p>
            Zakup kursów płatnych w serwisie odbywa się za pośrednictwem{" "}
            <Strong>Paddle jako Merchant of Record</Strong>. Oznacza to, że:
          </p>
          <Ul>
            <Li>
              umowa sprzedaży kursu płatnego jest zawierana między Użytkownikiem
              a{" "}
              <Strong>
                Paddle.com Market Limited (30 Old Bailey, London, EC4M 7AU,
                Wielka Brytania)
              </Strong>
              , a nie z Usługodawcą,
            </Li>
            <Li>
              Paddle przyjmuje płatność, wystawia dowód zakupu (paragon lub
              fakturę VAT) i rozlicza podatek VAT,
            </Li>
            <Li>
              do transakcji sprzedaży zastosowanie mają{" "}
              <a
                href="https://www.paddle.com/legal/buyer-terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 decoration-accent hover:no-underline"
              >
                Warunki Kupującego Paddle
              </a>{" "}
              (paddle.com/legal/buyer-terms),
            </Li>
            <Li>
              Usługodawca odpowiada za udostępnienie zakupionego kursu i jego
              merytoryczną zawartość.
            </Li>
          </Ul>
          <p>
            W sprawach związanych z dostępem do kursu, reklamacjami i zwrotami
            należy kontaktować się z Usługodawcą zgodnie z sekcją 12 niniejszego
            regulaminu.
          </p>
        </Section>

        {/* 8 */}
        <Section id="przedsprzedaz" title="8. Przedsprzedaż">
          <p>
            Wybrane kursy mogą być dostępne w trybie przedsprzedaży – możliwości
            zakupu przed oficjalną datą premiery. W takim przypadku:
          </p>
          <Ul>
            <Li>
              płatność jest pobierana w momencie złożenia zamówienia w
              przedsprzedaży,
            </Li>
            <Li>
              dostęp do kursu zostaje aktywowany w dniu jego oficjalnej premiery
              (data wskazana na stronie kursu).
            </Li>
          </Ul>
          <p>
            <Strong>Dobrowolna gwarancja zwrotu przy przedsprzedaży:</Strong>{" "}
            Użytkownik, który zakupił kurs w przedsprzedaży, może zrezygnować z
            zakupu i otrzymać pełny zwrot środków w terminie{" "}
            <Strong>30 dni od daty premiery kursu</Strong>, bez podania
            przyczyny. Wniosek o zwrot składa się przez formularz dostępny po
            zakupie w serwisie. Usługodawca przekazuje zatwierdzony wniosek do
            Paddle, który realizuje zwrot środków na rachunek płatniczy
            Użytkownika.
          </p>
        </Section>

        {/* 9 */}
        <Section id="ceny" title="9. Ceny">
          <p>
            Wszystkie ceny w serwisie są podawane w złotych polskich (PLN) i są
            cenami brutto (zawierają podatek VAT rozliczany przez Paddle).
          </p>
          <p>
            Serwis może prezentować cenę bieżącą (promocyjną) oraz cenę
            standardową. Cena bieżąca jest ceną faktycznie pobieraną w momencie
            zakupu. Usługodawca zastrzega sobie prawo do zmiany cen, przy czym
            zmiana ceny nie dotyczy zamówień już złożonych.
          </p>
        </Section>

        {/* 10 */}
        <Section id="dostawa" title="10. Dostawa treści cyfrowych">
          <p>
            Kurs płatny (treść cyfrowa) jest dostarczany w postaci dostępu
            online w serwisie:
          </p>
          <Ul>
            <Li>
              <Strong>przy zakupie standardowym</Strong> – niezwłocznie po
              potwierdzeniu płatności przez Paddle, nie później niż w ciągu
              kilku minut od zakończenia transakcji,
            </Li>
            <Li>
              <Strong>przy zakupie w przedsprzedaży</Strong> – w dniu oficjalnej
              premiery kursu.
            </Li>
          </Ul>
          <p>
            Dostęp jest aktywowany na koncie Użytkownika i dostępny przez
            przeglądarkę internetową bez konieczności pobierania plików.
          </p>
        </Section>

        {/* 11 */}
        <Section
          id="odstapienie"
          title="11. Prawo odstąpienia od umowy (konsumenci)"
        >
          <p>
            Konsumentowi przysługuje ustawowe prawo do odstąpienia od umowy
            zawartej na odległość bez podania przyczyny w terminie{" "}
            <Strong>14 dni od dnia zawarcia umowy</Strong>, zgodnie z ustawą z
            dnia 30 maja 2014 r. o prawach konsumenta (t.j. Dz. U. z 2020 r.
            poz. 287 ze zm.).
          </p>
          <p>
            Zgodnie z art. 38 pkt 13 ww. ustawy,{" "}
            <Strong>
              prawo odstąpienia nie przysługuje w odniesieniu do treści
              cyfrowych
            </Strong>{" "}
            (kursów), jeżeli spełnianie świadczenia rozpoczęło się za wyraźną
            zgodą Konsumenta przed upływem terminu do odstąpienia od umowy i po
            poinformowaniu go o utracie tego prawa. W praktyce oznacza to, że
            jeśli Konsument podczas zakupu wyraził zgodę na natychmiastowe
            udostępnienie kursu i przyjął do wiadomości utratę prawa odstąpienia
            – prawo to wygasa z chwilą udzielenia dostępu.
          </p>
          <p>
            Powyższe nie ogranicza dobrowolnej gwarancji zwrotu przy zakupach w
            przedsprzedaży opisanej w sekcji 8 niniejszego regulaminu.
          </p>
          <p>
            Oświadczenie o odstąpieniu od umowy (w przypadkach, gdy prawo to
            przysługuje) należy kierować do Usługodawcy na adres e-mail:{" "}
            <a
              href="mailto:zwroty@codebucket.pl"
              className="underline underline-offset-2 decoration-accent hover:no-underline"
            >
              zwroty@codebucket.pl
            </a>
            . Usługodawca przekazuje potwierdzone odstąpienie do Paddle w celu
            realizacji zwrotu środków.
          </p>
        </Section>

        {/* 12 */}
        <Section
          id="reklamacje"
          title="12. Reklamacje i zgodność treści z umową"
        >
          <p>
            Reklamacje oraz wnioski o zwrot środków we wszystkich sprawach
            kieruj do Usługodawcy:
          </p>
          <Ul>
            <Li>
              <Strong>Zwroty i odstąpienia od umowy</Strong> – e-mail:{" "}
              <a
                href="mailto:zwroty@codebucket.pl"
                className="underline underline-offset-2 decoration-accent hover:no-underline"
              >
                zwroty@codebucket.pl
              </a>{" "}
              lub (przy przedsprzedaży) formularz zwrotu dostępny w serwisie po
              zakupie.
            </Li>
            <Li>
              <Strong>
                Dostęp do kursu, działanie serwisu, treść kursu, faktury
              </Strong>{" "}
              – e-mail:{" "}
              <a
                href="mailto:kontakt@codebucket.pl"
                className="underline underline-offset-2 decoration-accent hover:no-underline"
              >
                kontakt@codebucket.pl
              </a>
              .
            </Li>
          </Ul>
          <p>
            Usługodawca przekazuje zatwierdzone wnioski o zwrot do Paddle w celu
            realizacji przelewu. W przypadku bezpośrednich zapytań do Paddle
            dotyczących historii transakcji możesz kontaktować się z Paddle pod
            adresem{" "}
            <a
              href="mailto:help@paddle.com"
              className="underline underline-offset-2 decoration-accent hover:no-underline"
            >
              help@paddle.com
            </a>
            .
          </p>
          <p>
            Treści cyfrowe w serwisie są zgodne z umową w rozumieniu rozdziału
            5b ustawy o prawach konsumenta (implementacja dyrektywy 2019/770).
            Konsument może żądać doprowadzenia treści do zgodności z umową, a
            jeżeli nie jest to możliwe lub wiązałoby się z nadmiernymi kosztami
            – odpowiedniego obniżenia ceny lub odstąpienia od umowy.
          </p>
          <p>
            Reklamacje składane do Usługodawcy są rozpatrywane w terminie
            <Strong> 14 dni kalendarzowych</Strong> od ich otrzymania. Odpowiedź
            zostanie przesłana na adres e-mail wskazany przez Użytkownika.
          </p>
        </Section>

        {/* 13 */}
        <Section id="spory" title="13. Pozasądowe rozwiązywanie sporów">
          <p>
            Konsument ma prawo skorzystać z pozasądowych metod rozwiązywania
            sporów:
          </p>
          <Ul>
            <Li>
              <Strong>Platforma ODR</Strong> (Online Dispute Resolution) Komisji
              Europejskiej dostępna pod adresem{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 decoration-accent hover:no-underline"
              >
                ec.europa.eu/consumers/odr
              </a>{" "}
              – umożliwia rozwiązywanie sporów wynikających z umów zawieranych
              online.
            </Li>
            <Li>
              <Strong>Urząd Ochrony Konkurencji i Konsumentów (UOKiK)</Strong> –
              informacje o pozasądowych metodach rozwiązywania sporów dostępne
              pod adresem{" "}
              <a
                href="https://www.uokik.gov.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 decoration-accent hover:no-underline"
              >
                uokik.gov.pl
              </a>
              .
            </Li>
            <Li>
              <Strong>Stały Polubowny Sąd Konsumencki</Strong> działający przy
              właściwym Inspektoracie Inspekcji Handlowej.
            </Li>
          </Ul>
          <p>
            Skorzystanie z powyższych możliwości jest dobrowolne i nie wyłącza
            prawa do dochodzenia roszczeń przed sądem powszechnym.
          </p>
        </Section>

        {/* 14 */}
        <Section id="dane-osobowe" title="14. Dane osobowe">
          <p>
            Zasady przetwarzania danych osobowych Użytkowników przez Usługodawcę
            określa{" "}
            <a
              href="/privacy"
              className="underline underline-offset-2 decoration-accent hover:no-underline"
            >
              Polityka prywatności
            </a>{" "}
            dostępna pod adresem codebucket.pl/privacy.
          </p>
          <p>
            Dane osobowe związane z zakupem (dane karty płatniczej, dane
            rozliczeniowe) są przetwarzane przez Paddle jako odrębnego
            administratora danych. Szczegóły znajdziesz w{" "}
            <a
              href="https://www.paddle.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 decoration-accent hover:no-underline"
            >
              Polityce prywatności Paddle
            </a>
            .
          </p>
        </Section>

        {/* 15 */}
        <Section id="zmiany" title="15. Zmiany regulaminu">
          <p>
            Usługodawca zastrzega sobie prawo do zmiany niniejszego regulaminu.
            O istotnych zmianach Użytkownicy zostaną poinformowani drogą
            e-mailową na adres powiązany z kontem lub komunikatem w serwisie, z
            wyprzedzeniem co najmniej{" "}
            <Strong>14 dni przed wejściem zmian w życie</Strong>.
          </p>
          <p>
            Dalsze korzystanie z serwisu po wejściu zmian w życie jest
            równoznaczne z akceptacją zaktualizowanego regulaminu. Użytkownik,
            który nie akceptuje zmian, może usunąć konto przed datą ich
            obowiązywania.
          </p>
          <p>
            Aktualna wersja regulaminu jest zawsze dostępna pod adresem{" "}
            <span className="font-medium text-foreground">
              codebucket.pl/terms
            </span>
            .
          </p>
        </Section>

        {/* 16 */}
        <Section id="postanowienia-koncowe" title="16. Postanowienia końcowe">
          <p>
            W sprawach nieuregulowanych niniejszym regulaminem stosuje się
            przepisy prawa polskiego, w szczególności:
          </p>
          <Ul>
            <Li>
              ustawy z dnia 18 lipca 2002 r. o świadczeniu usług drogą
              elektroniczną (t.j. Dz. U. z 2020 r. poz. 344 ze zm.),
            </Li>
            <Li>
              ustawy z dnia 30 maja 2014 r. o prawach konsumenta (t.j. Dz. U. z
              2020 r. poz. 287 ze zm.),
            </Li>
            <Li>
              rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679
              (RODO).
            </Li>
          </Ul>
          <p>Niniejszy regulamin wchodzi w życie z dniem {LAST_UPDATED}.</p>
          <p>
            Ewentualne spory wynikające ze stosowania niniejszego regulaminu
            będą rozstrzygane przez sąd właściwy według przepisów kodeksu
            postępowania cywilnego. Powyższe nie ogranicza praw Konsumentów
            wynikających z obowiązujących przepisów prawa.
          </p>
        </Section>
      </div>
    </MainContainer>
  );
}
