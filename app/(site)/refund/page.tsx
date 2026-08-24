import {
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
  title: "Zasady zwrotów – CodeBucket",
};

const LAST_UPDATED = "24 sierpnia 2026 r.";

export default function RefundPage() {
  return (
    <LegalDocument>
      <LegalHeader title="Zasady zwrotów" lastUpdated={LAST_UPDATED}>
        <p className="text-sm sm:text-base">
          Niniejsza strona określa zasady zwrotów płatności za kursy w serwisie
          CodeBucket (
          <LegalEmph>codebucket.pl</LegalEmph>
          ), zarówno za kursy już dostępne, jak i za kursy zakupione w
          przedsprzedaży.
        </p>
      </LegalHeader>

      <LegalSection id="ogolne" title="1. Postanowienia ogólne">
        <p>
          Zakup kursów płatnych odbywa się za pośrednictwem{" "}
          <LegalStrong>Paddle.com Market Limited</LegalStrong> jako Merchant of
          Record. W sprawie zwrotu możesz skontaktować się z CodeBucket albo
          bezpośrednio z Paddle. Niezależnie od wybranego kanału sam zwrot
          środków realizuje Paddle – na rachunek płatniczy Użytkownika, tą samą
          metodą płatności, której użyto przy zakupie.
        </p>
        <p>
          Do transakcji sprzedaży zastosowanie mają również{" "}
          <LegalLink href="https://www.paddle.com/legal/buyer-terms" external>
            Warunki Kupującego Paddle
          </LegalLink>
          .
        </p>
      </LegalSection>

      <LegalSection
        id="kursy-dostepne"
        title="2. Zwroty za kursy już dostępne"
      >
        <p>
          Użytkownik, który zakupił kurs już dostępny, może zrezygnować z zakupu
          i otrzymać pełny zwrot środków w terminie{" "}
          <LegalStrong>30 dni od daty zakupu</LegalStrong>, bez podania
          przyczyny.
        </p>
        <p>
          Jest to dobrowolna gwarancja satysfakcji Usługodawcy. Spełnia ona i
          przewyższa ustawowe prawo konsumenta do odstąpienia od umowy
          zawartej na odległość w terminie 14 dni bez podania przyczyny.
        </p>
      </LegalSection>

      <LegalSection
        id="przedsprzedaz"
        title="3. Zwroty za kursy w przedsprzedaży"
      >
        <p>
          Użytkownik, który zakupił kurs w przedsprzedaży, może zrezygnować z
          zakupu i otrzymać pełny zwrot środków w terminie{" "}
          <LegalStrong>30 dni od daty premiery kursu</LegalStrong>, bez podania
          przyczyny.
        </p>
        <p>
          Gwarancja obowiązuje również przed premierą: możesz złożyć wniosek o
          zwrot w dowolnym momencie od zakupu aż do upływu 30 dni od daty
          premiery. Data premiery jest wskazana na stronie kursu. Jeśli termin
          premiery ulegnie zmianie, poinformujemy Cię o tym mailowo – prawo do
          zwrotu pozostaje w mocy.
        </p>
      </LegalSection>

      <LegalSection
        id="odstapienie"
        title="4. Ustawowe prawo odstąpienia od umowy"
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
          Powyższe nie ogranicza dobrowolnej 30-dniowej gwarancji satysfakcji
          opisanej w sekcjach 2 i 3. Gwarancja ta jest korzystniejsza dla
          Użytkownika niż ustawowe minimum i przysługuje niezależnie od
          ustawowego wyjątku dla treści cyfrowych.
        </p>
      </LegalSection>

      <LegalSection id="wniosek" title="5. Jak złożyć wniosek o zwrot">
        <p>
          Wniosek o zwrot możesz zgłosić na jeden z poniższych sposobów:
        </p>
        <LegalList>
          <LegalListItem>
            przez <LegalLink href="/refund/request">formularz zwrotu</LegalLink>,
          </LegalListItem>
          <LegalListItem>
            na adres{" "}
            <LegalLink href="mailto:zwroty@codebucket.pl">
              zwroty@codebucket.pl
            </LegalLink>
            ,
          </LegalListItem>
          <LegalListItem>
            bezpośrednio do Paddle na adres{" "}
            <LegalLink href="mailto:help@paddle.com">help@paddle.com</LegalLink>.
          </LegalListItem>
        </LegalList>
        <p>
          Wniosek złożony u Usługodawcy jest rozpatrywany w terminie{" "}
          <LegalStrong>14 dni kalendarzowych</LegalStrong> od jego otrzymania i
          po zatwierdzeniu przekazywany do Paddle. Niezależnie od wybranego
          kanału sam zwrot środków realizuje Paddle – tą samą metodą płatności,
          której użyto przy zakupie.
        </p>
        <p>
          Pod adresem{" "}
          <LegalLink href="mailto:help@paddle.com">help@paddle.com</LegalLink>{" "}
          uzyskasz też pomoc w sprawach dotyczących historii transakcji.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
