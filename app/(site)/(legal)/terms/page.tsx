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
  title: "Regulamin – CodeBucket",
};

const LAST_UPDATED = "24 sierpnia 2026 r.";

export default function TermsPage() {
  return (
    <LegalDocument>
      <LegalHeader title="Regulamin" lastUpdated={LAST_UPDATED}>
        <p className="text-sm sm:text-base">
          Niniejszy regulamin określa zasady korzystania z serwisu CodeBucket
          dostępnego pod adresem <LegalEmph>codebucket.pl</LegalEmph>. Prosimy o
          uważne zapoznanie się z jego treścią przed rozpoczęciem korzystania z
          serwisu.
        </p>
      </LegalHeader>

      {/* 1 */}
      <LegalSection id="definicje" title="1. Postanowienia ogólne i definicje">
        <p>Użyte w niniejszym regulaminie pojęcia oznaczają:</p>
        <LegalList>
          <LegalListItem>
            <LegalStrong>Usługodawca</LegalStrong> – Oskar Goczał, prowadzący
            serwis CodeBucket pod adresem codebucket.pl; adres kontaktowy:{" "}
            <LegalLink href="mailto:kontakt@codebucket.pl">
              kontakt@codebucket.pl
            </LegalLink>
            .
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Sprzedawca / Merchant of Record</LegalStrong> –
            Paddle.com Market Limited, spółka zarejestrowana w Anglii i Walii
            pod numerem 8172165, z siedzibą pod adresem 30 Old Bailey, London,
            EC4M 7AU, Wielka Brytania. Paddle pełni rolę autoryzowanego
            sprzedawcy (resellera) kursów płatnych w serwisie i jest podmiotem
            odpowiedzialnym za przyjmowanie płatności, wystawianie dokumentów
            sprzedaży i rozliczanie podatku VAT.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Serwis</LegalStrong> – platforma edukacyjna dostępna
            pod adresem codebucket.pl.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Użytkownik</LegalStrong> – każda osoba fizyczna, która
            korzysta z serwisu.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Konsument</LegalStrong> – Użytkownik będący osobą
            fizyczną dokonującą czynności prawnej niezwiązanej bezpośrednio z
            jej działalnością gospodarczą lub zawodową.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Konto</LegalStrong> – indywidualne konto Użytkownika w
            serwisie utworzone po rejestracji.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Kurs</LegalStrong> – zorganizowany materiał edukacyjny
            dostępny w serwisie, składający się z lekcji, ćwiczeń, quizów i
            projektów.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Treść cyfrowa</LegalStrong> – kurs lub jego część w
            rozumieniu art. 2 pkt 5 dyrektywy 2019/770 (o dostarczaniu treści
            cyfrowych i usług cyfrowych).
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Przedsprzedaż</LegalStrong> – możliwość zakupu kursu
            przed datą jego oficjalnej premiery.
          </LegalListItem>
        </LegalList>
        <p>
          Serwis jest prowadzony przez Usługodawcę, który jest autorem i
          dostawcą treści edukacyjnych. Sprzedaż kursów płatnych odbywa się za
          pośrednictwem Paddle jako Merchant of Record – to oznacza, że umowa
          sprzedaży kursu płatnego jest zawierana między Użytkownikiem a Paddle,
          a nie bezpośrednio z Usługodawcą.
        </p>
      </LegalSection>

      {/* 2 */}
      <LegalSection id="kontakt" title="2. Dane kontaktowe Usługodawcy">
        <p>
          W sprawach dotyczących działania serwisu, dostępu do treści i
          reklamacji merytorycznych możesz kontaktować się z Usługodawcą:
        </p>
        <LegalContactCard />
      </LegalSection>

      {/* 3 */}
      <LegalSection id="wymagania" title="3. Wymagania techniczne">
        <p>Do korzystania z serwisu niezbędne są:</p>
        <LegalList>
          <LegalListItem>
            urządzenie z dostępem do internetu i aktualną przeglądarką
            internetową obsługującą JavaScript (np. Chrome, Firefox, Edge,
            Safari w aktualnych wersjach),
          </LegalListItem>
          <LegalListItem>aktywny adres e-mail,</LegalListItem>
          <LegalListItem>
            włączona obsługa plików cookies (wymagana do utrzymania sesji
            zalogowanego użytkownika).
          </LegalListItem>
        </LegalList>
        <p>
          Interaktywne ćwiczenia programistyczne działają w oparciu o edytor
          kodu Monaco osadzony w przeglądarce – nie wymaga instalacji
          dodatkowego oprogramowania.
        </p>
      </LegalSection>

      {/* 4 */}
      <LegalSection id="usługi" title="4. Rodzaje usług">
        <p>Serwis oferuje następujące rodzaje usług:</p>
        <LegalList>
          <LegalListItem>
            <LegalStrong>Usługi bezpłatne:</LegalStrong> założenie i prowadzenie
            konta, dostęp do kursów oznaczonych jako darmowe, śledzenie postępów
            w nauce, dostęp do części demonstracyjnej kursów płatnych.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Usługi płatne:</LegalStrong> dostęp do kursów płatnych.
          </LegalListItem>
        </LegalList>
        <p>
          Szczegółowy zakres każdego kursu jest opisany na jego stronie w
          serwisie przed dokonaniem zakupu.
        </p>
      </LegalSection>

      {/* 5 */}
      <LegalSection id="konto" title="5. Rejestracja i konto">
        <p>
          Korzystanie z serwisu w pełnym zakresie wymaga założenia konta.
          Rejestracja odbywa się przez podanie adresu e-mail i hasła
          (uwierzytelnianie realizowane przez Firebase Authentication).
        </p>
        <p>Użytkownik zobowiązuje się do:</p>
        <LegalList>
          <LegalListItem>
            podania prawdziwych danych podczas rejestracji,
          </LegalListItem>
          <LegalListItem>
            zachowania poufności danych logowania i nieudostępniania ich osobom
            trzecim,
          </LegalListItem>
          <LegalListItem>
            niezwłocznego powiadomienia Usługodawcy o nieautoryzowanym dostępie
            do konta.
          </LegalListItem>
        </LegalList>
        <p>
          Usługodawca zastrzega sobie prawo do zawieszenia lub usunięcia konta w
          przypadku naruszenia niniejszego regulaminu. Użytkownik może w każdej
          chwili zażądać usunięcia konta, wysyłając wiadomość na adres{" "}
          <LegalLink href="mailto:kontakt@codebucket.pl">
            kontakt@codebucket.pl
          </LegalLink>
          .
        </p>
      </LegalSection>

      {/* 6 */}
      <LegalSection id="licencja" title="6. Licencja na treści">
        <p>
          Z chwilą uzyskania dostępu do kursu (bezpłatnego lub płatnego)
          Użytkownik otrzymuje niewyłączną, niezbywalną, nieprzenaszalną
          licencję na korzystanie z treści wyłącznie do własnych celów
          edukacyjnych.
        </p>
        <p>Licencja nie obejmuje w szczególności prawa do:</p>
        <LegalList>
          <LegalListItem>
            kopiowania, powielania lub dystrybucji treści w całości ani w
            części,
          </LegalListItem>
          <LegalListItem>
            publicznego udostępniania treści osobom trzecim (w tym publikacji w
            serwisach streamingowych, mediach społecznościowych itp.),
          </LegalListItem>
          <LegalListItem>
            odsprzedaży, sublicencjonowania lub komercyjnego wykorzystania
            treści,
          </LegalListItem>
          <LegalListItem>
            tworzenia materiałów pochodnych opartych na treściach serwisu bez
            pisemnej zgody Usługodawcy.
          </LegalListItem>
        </LegalList>
        <p>
          Wszelkie prawa własności intelektualnej do treści w serwisie pozostają
          własnością Usługodawcy lub podmiotów, które udzieliły mu stosownych
          licencji.
        </p>
      </LegalSection>

      {/* 7 */}
      <LegalSection id="platnosci" title="7. Zakup kursów płatnych i płatności">
        <p>
          Proces składania zamówienia jest prowadzony przez naszego
          internetowego resellera Paddle.com. Paddle.com jest Merchant of Record
          (autoryzowanym sprzedawcą) dla wszystkich naszych zamówień. Paddle
          realizuje zwroty środków oraz uczestniczy w obsłudze klienta.
        </p>
        <p>
          Zakup kursów płatnych w serwisie odbywa się za pośrednictwem{" "}
          <LegalStrong>Paddle jako Merchant of Record</LegalStrong>. Oznacza to,
          że:
        </p>
        <LegalList>
          <LegalListItem>
            umowa sprzedaży kursu płatnego jest zawierana między Użytkownikiem a{" "}
            <LegalStrong>
              Paddle.com Market Limited (30 Old Bailey, London, EC4M 7AU, Wielka
              Brytania)
            </LegalStrong>
            , a nie z Usługodawcą,
          </LegalListItem>
          <LegalListItem>
            Paddle przyjmuje płatność, wystawia dowód zakupu (paragon lub
            fakturę VAT), rozlicza podatek VAT oraz realizuje zwroty środków,
          </LegalListItem>
          <LegalListItem>
            do transakcji sprzedaży zastosowanie mają{" "}
            <LegalLink href="https://www.paddle.com/legal/buyer-terms" external>
              Warunki Kupującego Paddle
            </LegalLink>{" "}
            (paddle.com/legal/buyer-terms),
          </LegalListItem>
          <LegalListItem>
            Usługodawca odpowiada za udostępnienie zakupionego kursu i jego
            merytoryczną zawartość.
          </LegalListItem>
        </LegalList>
        <p>
          W sprawie zwrotu środków możesz skontaktować się z Usługodawcą
          (zgodnie z sekcją 12 niniejszego regulaminu) albo bezpośrednio z
          Paddle. Niezależnie od wybranego kanału sam zwrot środków realizuje
          Paddle. Pełne zasady zwrotów znajdziesz na stronie{" "}
          <LegalLink href="/refund">Zasady zwrotów</LegalLink>.
        </p>
      </LegalSection>

      {/* 8 */}
      <LegalSection id="przedsprzedaz" title="8. Przedsprzedaż">
        <p>
          Wybrane kursy mogą być dostępne w trybie przedsprzedaży – możliwości
          zakupu przed oficjalną datą premiery. W takim przypadku:
        </p>
        <LegalList>
          <LegalListItem>
            płatność jest pobierana w momencie złożenia zamówienia w
            przedsprzedaży,
          </LegalListItem>
          <LegalListItem>
            dostęp do kursu zostaje aktywowany w dniu jego oficjalnej premiery
            (data wskazana na stronie kursu).
          </LegalListItem>
        </LegalList>
        <p>
          <LegalStrong>
            Dobrowolna gwarancja zwrotu przy przedsprzedaży:
          </LegalStrong>{" "}
          Użytkownik, który zakupił kurs w przedsprzedaży, może zrezygnować z
          zakupu i otrzymać pełny zwrot środków w terminie{" "}
          <LegalStrong>30 dni od daty premiery kursu</LegalStrong>, bez podania
          przyczyny. Wniosek o zwrot składasz przez{" "}
          <LegalLink href="/refund/request">formularz zwrotu</LegalLink>.
          Usługodawca przekazuje zatwierdzony wniosek do Paddle, który realizuje
          zwrot środków na rachunek płatniczy Użytkownika.
        </p>
        <p>
          Pełne zasady zwrotów – także dla kursów już dostępnych – znajdziesz na
          stronie <LegalLink href="/refund">Zasady zwrotów</LegalLink>.
        </p>
      </LegalSection>

      {/* 9 */}
      <LegalSection id="ceny" title="9. Ceny">
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
      </LegalSection>

      {/* 10 */}
      <LegalSection id="dostawa" title="10. Dostawa treści cyfrowych">
        <p>
          Kurs płatny (treść cyfrowa) jest dostarczany w postaci dostępu online
          w serwisie:
        </p>
        <LegalList>
          <LegalListItem>
            <LegalStrong>przy zakupie standardowym</LegalStrong> – niezwłocznie
            po potwierdzeniu płatności przez Paddle, nie później niż w ciągu
            kilku minut od zakończenia transakcji,
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>przy zakupie w przedsprzedaży</LegalStrong> – w dniu
            oficjalnej premiery kursu.
          </LegalListItem>
        </LegalList>
        <p>
          Dostęp jest aktywowany na koncie Użytkownika i dostępny przez
          przeglądarkę internetową bez konieczności pobierania plików.
        </p>
      </LegalSection>

      {/* 11 */}
      <LegalSection
        id="odstapienie"
        title="11. Prawo odstąpienia od umowy (konsumenci)"
      >
        <p>
          Konsumentowi przysługuje ustawowe prawo do odstąpienia od umowy
          zawartej na odległość bez podania przyczyny w terminie{" "}
          <LegalStrong>14 dni od dnia zawarcia umowy</LegalStrong>, zgodnie z
          ustawą z dnia 30 maja 2014 r. o prawach konsumenta (t.j. Dz. U. z 2020
          r. poz. 287 ze zm.).
        </p>
        <p>
          Zgodnie z art. 38 pkt 13 ww. ustawy,{" "}
          <LegalStrong>
            prawo odstąpienia nie przysługuje w odniesieniu do treści cyfrowych
          </LegalStrong>{" "}
          (kursów), jeżeli spełnianie świadczenia rozpoczęło się za wyraźną
          zgodą Konsumenta przed upływem terminu do odstąpienia od umowy i po
          poinformowaniu go o utracie tego prawa. W praktyce oznacza to, że
          jeśli Konsument podczas zakupu wyraził zgodę na natychmiastowe
          udostępnienie kursu i przyjął do wiadomości utratę prawa odstąpienia –
          prawo to wygasa z chwilą udzielenia dostępu.
        </p>
        <p>
          Powyższe nie ogranicza dobrowolnej 30-dniowej gwarancji satysfakcji.
          Przy kursach już dostępnych przysługuje pełny zwrot w terminie{" "}
          <LegalStrong>30 dni od daty zakupu</LegalStrong>, bez podania
          przyczyny. Przy zakupach w przedsprzedaży – w terminie{" "}
          <LegalStrong>30 dni od daty premiery kursu</LegalStrong> (sekcja 8).
          Gwarancja ta spełnia i przewyższa ustawowe 14 dni na odstąpienie bez
          podania przyczyny. Pełne zasady znajdziesz na stronie{" "}
          <LegalLink href="/refund">Zasady zwrotów</LegalLink>.
        </p>
        <p>
          Oświadczenie o odstąpieniu od umowy (w przypadkach, gdy prawo to
          przysługuje) oraz wniosek o zwrot w ramach gwarancji satysfakcji
          składasz przez{" "}
          <LegalLink href="/refund/request">formularz zwrotu</LegalLink> lub na
          adres e-mail:{" "}
          <LegalLink href="mailto:zwroty@codebucket.pl">
            zwroty@codebucket.pl
          </LegalLink>
          . Możesz też skontaktować się w sprawie zwrotu bezpośrednio z Paddle.
          Sam zwrot środków – niezależnie od wybranego kanału – realizuje Paddle.
        </p>
      </LegalSection>

      {/* 12 */}
      <LegalSection
        id="reklamacje"
        title="12. Reklamacje i zgodność treści z umową"
      >
        <p>
          Reklamacje oraz wnioski o zwrot środków możesz kierować do Usługodawcy
          albo – w sprawie zwrotu – bezpośrednio do Paddle:
        </p>
        <LegalList>
          <LegalListItem>
            <LegalStrong>Zwroty i odstąpienia od umowy</LegalStrong> –{" "}
            <LegalLink href="/refund/request">formularz zwrotu</LegalLink>,
            e-mail:{" "}
            <LegalLink href="mailto:zwroty@codebucket.pl">
              zwroty@codebucket.pl
            </LegalLink>{" "}
            lub bezpośrednio Paddle:{" "}
            <LegalLink href="mailto:help@paddle.com">help@paddle.com</LegalLink>.
            Pełne zasady: <LegalLink href="/refund">Zasady zwrotów</LegalLink>.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>
              Dostęp do kursu, działanie serwisu, treść kursu, faktury
            </LegalStrong>{" "}
            – e-mail:{" "}
            <LegalLink href="mailto:kontakt@codebucket.pl">
              kontakt@codebucket.pl
            </LegalLink>
            .
          </LegalListItem>
        </LegalList>
        <p>
          Wniosek o zwrot złożony u Usługodawcy jest przez niego zatwierdzany i
          przekazywany do Paddle, które realizuje zwrot środków. Zwrot możesz
          też zgłosić bezpośrednio do Paddle. Pod adresem{" "}
          <LegalLink href="mailto:help@paddle.com">help@paddle.com</LegalLink>{" "}
          uzyskasz również pomoc w sprawach dotyczących historii transakcji.
        </p>
        <p>
          Treści cyfrowe w serwisie są zgodne z umową w rozumieniu rozdziału 5b
          ustawy o prawach konsumenta (implementacja dyrektywy 2019/770).
          Konsument może żądać doprowadzenia treści do zgodności z umową, a
          jeżeli nie jest to możliwe lub wiązałoby się z nadmiernymi kosztami –
          odpowiedniego obniżenia ceny lub odstąpienia od umowy.
        </p>
        <p>
          Reklamacje składane do Usługodawcy są rozpatrywane w terminie
          <LegalStrong> 14 dni kalendarzowych</LegalStrong> od ich otrzymania.
          Odpowiedź zostanie przesłana na adres e-mail wskazany przez
          Użytkownika.
        </p>
      </LegalSection>

      {/* 13 */}
      <LegalSection id="spory" title="13. Pozasądowe rozwiązywanie sporów">
        <p>
          Konsument ma prawo skorzystać z pozasądowych metod rozwiązywania
          sporów:
        </p>
        <LegalList>
          <LegalListItem>
            <LegalStrong>Platforma ODR</LegalStrong> (Online Dispute Resolution)
            Komisji Europejskiej dostępna pod adresem{" "}
            <LegalLink href="https://ec.europa.eu/consumers/odr" external>
              ec.europa.eu/consumers/odr
            </LegalLink>{" "}
            – umożliwia rozwiązywanie sporów wynikających z umów zawieranych
            online.
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>
              Urząd Ochrony Konkurencji i Konsumentów (UOKiK)
            </LegalStrong>{" "}
            – informacje o pozasądowych metodach rozwiązywania sporów dostępne
            pod adresem{" "}
            <LegalLink href="https://www.uokik.gov.pl" external>
              uokik.gov.pl
            </LegalLink>
            .
          </LegalListItem>
          <LegalListItem>
            <LegalStrong>Stały Polubowny Sąd Konsumencki</LegalStrong>{" "}
            działający przy właściwym Inspektoracie Inspekcji Handlowej.
          </LegalListItem>
        </LegalList>
        <p>
          Skorzystanie z powyższych możliwości jest dobrowolne i nie wyłącza
          prawa do dochodzenia roszczeń przed sądem powszechnym.
        </p>
      </LegalSection>

      {/* 14 */}
      <LegalSection id="dane-osobowe" title="14. Dane osobowe">
        <p>
          Zasady przetwarzania danych osobowych Użytkowników przez Usługodawcę
          określa <LegalLink href="/privacy">Polityka prywatności</LegalLink>{" "}
          dostępna pod adresem codebucket.pl/privacy.
        </p>
        <p>
          Dane osobowe związane z zakupem (dane karty płatniczej, dane
          rozliczeniowe) są przetwarzane przez Paddle jako odrębnego
          administratora danych. Szczegóły znajdziesz w{" "}
          <LegalLink href="https://www.paddle.com/legal/privacy" external>
            Polityce prywatności Paddle
          </LegalLink>
          .
        </p>
      </LegalSection>

      {/* 15 */}
      <LegalSection id="zmiany" title="15. Zmiany regulaminu">
        <p>
          Usługodawca zastrzega sobie prawo do zmiany niniejszego regulaminu. O
          istotnych zmianach Użytkownicy zostaną poinformowani drogą e-mailową
          na adres powiązany z kontem lub komunikatem w serwisie, z
          wyprzedzeniem co najmniej{" "}
          <LegalStrong>14 dni przed wejściem zmian w życie</LegalStrong>.
        </p>
        <p>
          Dalsze korzystanie z serwisu po wejściu zmian w życie jest
          równoznaczne z akceptacją zaktualizowanego regulaminu. Użytkownik,
          który nie akceptuje zmian, może usunąć konto przed datą ich
          obowiązywania.
        </p>
        <p>
          Aktualna wersja regulaminu jest zawsze dostępna pod adresem{" "}
          <LegalEmph>codebucket.pl/terms</LegalEmph>.
        </p>
      </LegalSection>

      {/* 16 */}
      <LegalSection
        id="postanowienia-koncowe"
        title="16. Postanowienia końcowe"
      >
        <p>
          W sprawach nieuregulowanych niniejszym regulaminem stosuje się
          przepisy prawa polskiego, w szczególności:
        </p>
        <LegalList>
          <LegalListItem>
            ustawy z dnia 18 lipca 2002 r. o świadczeniu usług drogą
            elektroniczną (t.j. Dz. U. z 2020 r. poz. 344 ze zm.),
          </LegalListItem>
          <LegalListItem>
            ustawy z dnia 30 maja 2014 r. o prawach konsumenta (t.j. Dz. U. z
            2020 r. poz. 287 ze zm.),
          </LegalListItem>
          <LegalListItem>
            rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).
          </LegalListItem>
        </LegalList>
        <p>Niniejszy regulamin wchodzi w życie z dniem {LAST_UPDATED}.</p>
        <p>
          Ewentualne spory wynikające ze stosowania niniejszego regulaminu będą
          rozstrzygane przez sąd właściwy według przepisów kodeksu postępowania
          cywilnego. Powyższe nie ogranicza praw Konsumentów wynikających z
          obowiązujących przepisów prawa.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
