# Filmy do nagrania — kurs „Podstawy CSS”

> Źródło rozdziałów: `[V]` w `structure-detailed.md`.  
> **Format:** szybkie tempo, animacje i wizualizacje, gotowe przykłady (bez pisania kodu na żywo — kod zostaje w `[Pg]`, `[Ec]` i demo `[Di]`).  
> **Razem:** 22 filmy · **~1 h 38 min** materiału w kursie.

---

## Zasady produkcji (wszystkie filmy)

| Aspekt        | Zasada                                                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tempo         | ~1 koncept na 30–60 s; zero długich pauz i „poczekaj aż skopiuję”                                                                                  |
| Wizualizacja  | Animowane diagramy (box-model, flex osie, drzewo selektorów, warstwy `z-index`), before/after, podświetlanie fragmentów DOM                        |
| Kod           | Pre-renderowane snippety z podświetleniem składni; ewentualnie edytor z już wpisanym kodem + szybkie podświetlenie linii — **nie** piszemy od zera |
| Kontekst      | Przykłady na motywie wiadro.ai tam, gdzie ma to sens (logo, karta planu, header)                                                                   |
| Most do kursu | Na końcu krótkie „w aplikacji przećwiczysz to w…” → `[Di]` / `[Ec]` / `[Pg]`                                                                       |

---

## Moduł 1 — Podstawy

### 1.1 Wprowadzenie do CSS · **~3 min**

**Rozdziały filmu:**

1. Rola CSS względem HTML (strona bez stylów → z stylami — animacja)
2. Trzy sposoby dołączenia: inline / internal / external — kiedy który (diagram)
3. Anatomia reguły: selektor + `{ właściwość: wartość; }`
4. Klasa (`.`) vs id (`#`) — wizualne celowanie w elementy
5. Konflikt reguł — intuicja specyficzności (id > klasa, bez liczenia)
6. Dziedziczenie — `color` przechodzi na potomków, `margin` nie
7. Pierwsze właściwości: `color`, `font-size` na logo wiadro.ai

**Po filmie w kursie:** `[Di] 1.2` → `[Ec] 1.3` → quiz → kolory.

---

### 1.5 Kolory w CSS · **~1 min**

**Rozdziały filmu:**

1. `color` vs `background-color` — dwa różne cele
2. Formaty: nazwa → hex (3/6 znaków) → `rgb()` → `rgba()` → `hsl()`
3. Przezroczystość: kanał alfa w `rgba` vs właściwość `opacity`
4. Ten sam kolor — trzy zapisy obok siebie (animacja konwersji)

**Po filmie w kursie:** `[Di] 1.6` live picker → typografia.

---

### 1.7 Czcionka w CSS · **~3 min**

**Rozdziały filmu:**

1. `font-family` + stos fallbacków
2. `font-size`, `font-weight`, `font-style`
3. `text-decoration`, `text-align`, `line-height`
4. Zawijanie: `white-space`, `overflow-wrap`
5. `<span>` do stylowania fragmentu (np. `.ai` w kolorze akcentu)
6. Zapowiedź: Poppins + Inter w `[Pg] 1.8`

**Po filmie w kursie:** `[Pg] 1.8` typografia wiadro.ai → `[Di] 1.9` → ćwiczenie → `[Pi]`.

---

**Moduł 1 — suma:** 3 filmy · **~7 min**

---

## Moduł 2 — Layout strony internetowej

### 2.1 Elementy blokowe i inline · **~3 min**

**Rozdziały filmu:**

1. `div` vs `span` — blok vs linia tekstu
2. `display: block | inline | inline-block` — animacja zachowania w rzędzie
3. `width` / `height` — kiedy działają, kiedy są ignorowane
4. `min-width`, `max-width`, `min-height`, `max-height`
5. `display: none` vs `visibility: hidden` — znika z layoutu vs zostaje „duch”

**Po filmie w kursie:** `[Di] 2.2` → `[Ec] 2.3` → box-model.

---

### 2.4 CSS box-model · **~4 min**

**Rozdziały filmu:**

1. Warstwy: content → padding → border → margin (animowany przekrój pudełka)
2. Jak liczona jest szerokość elementu
3. Pułapka `content-box`: 200px + padding + border ≠ 200px wizualnie
4. Rozwiązanie: `box-sizing: border-box`
5. Globalny reset `* { box-sizing: border-box }` — dlaczego wszyscy tak robią

**Po filmie w kursie:** `[Di] 2.5` interaktywne pudełko → `[Pg] 2.6` karta produktu.

---

### 2.8 Stylowanie zdjęć · **~2 min**

**Rozdziały filmu:**

1. `<img>` + `object-fit`: `cover` / `contain` / `fill` — trzy kadry tego samego zdjęcia wiadra
2. `background-image` + `background-size` / `position` / `repeat`
3. Kiedy `<img>`, kiedy tło CSS (decision tree)

**Po filmie w kursie:** `[Ei] 2.9` object-fit → gradienty.

---

### 2.10 Gradienty w CSS · **~4 min**

**Rozdziały filmu:**

1. `linear-gradient(kąt, kolor1, kolor2)` — składnia
2. Stopnie procentowe — więcej niż dwa kolory
3. `radial-gradient` — szybki kontrast z linear
4. Gradient jako wartość `background` (nagłówek karty Enterprise)

**Po filmie w kursie:** `[Di] 2.11` edytor → `[Ec] 2.12` → `[Pg] 2.13`.

---

### 2.15 Jednostki w CSS · **~2 min**

**Rozdziały filmu:**

1. `px` — absolutne, kiedy OK (obramowania, cienie)
2. `rem` — względem root; skalowanie tekstu
3. `em` — względem rodzica; pułapka kaskady (animacja „rosnących” zagnieżdżeń)
4. `%` — względem kontenera
5. `vw` / `vh` — wzmianka
6. Praktyka kursu: tekst w `rem`, layout w `%` / `rem`

**Po filmie w kursie:** quiz 2.16 → overflow.

---

### 2.17 Overflow · **~2 min**

**Rozdziały filmu:**

1. Co się dzieje, gdy treść nie mieści się w kontenerze
2. `overflow: visible | hidden | scroll | auto`
3. `overflow-x` / `overflow-y` — niezależne osie
4. Przykład: przewijalna lista cech planu wiadro.ai

**Po filmie w kursie:** flexbox.

---

### 2.18 Flexbox · **~10 min**

**Rozdziały filmu:**

1. `display: flex` — kontener vs elementy potomne
2. Oś główna i poprzeczna (animowany kompas)
3. `flex-direction`, `justify-content`, `align-items`, `gap`
4. `flex-wrap` — zawijanie wierszy
5. `flex-grow` / `flex-shrink` / `flex-basis` — elastyczność elementów
6. Flex w flexie — header + karta z wewnętrznym flexem

**Po filmie w kursie:** `[Ei] 2.19` playground → `[Ec] 2.20` → `[Pg] 2.21` sklep.

> **YouTube:** ten film (lub skrócona wersja ~10 min) = „CSS Flexbox w 10 minut” z `business model/youtube/general.md`.

---

### 2.23 Pozycjonowanie elementów na stronie · **~5 min**

**Rozdziały filmu:**

1. `static` — domyślny flow
2. `relative` — punkt odniesienia + lekkie przesunięcie
3. `absolute` — względem pozycjonowanego przodka (animacja „kotwicy”)
4. `fixed` vs `sticky` — scroll i przyklejenie
5. `top` / `right` / `bottom` / `left` + `z-index` i warstwy

**Po filmie w kursie:** `[Di] 2.24` → `[Ei] 2.25` → `[Pg] 2.26` badge + sticky header.

> **YouTube:** skrócona wersja ~5 min = „CSS Position w 5 minut”.

---

**Moduł 2 — suma:** 8 filmów · **~32 min**

---

## Moduł 3 — Selektory, stany i transformacje

### 3.1 Kombinatory · **~4 min**

**Rozdziały filmu:**

1. Potomek (spacja) — dowolna głębokość
2. Dziecko (`>`) — tylko bezpośredni
3. Sąsiedni (`+`) i ogólny (`~`) rodzeństwo
4. Grupowanie (`,`) — jedna reguła, wiele selektorów
5. Drzewo HTML z podświetlaniem trafionych elementów

**Po filmie w kursie:** `[Pg] 3.2` refaktor → `[Ei] 3.3`.

---

### 3.4 Specyficzność i kaskada · **~6 min**

**Rozdziały filmu:**

1. Punktacja: inline > id > klasa > typ
2. Liczenie krok po kroku na przykładzie (licznik na ekranie)
3. Remis → wygrywa późniejsza reguła w pliku
4. `!important` — działa, ale dlaczego unikać
5. Podgląd konfliktu w DevTools (screenshot / nagranie ekranu)

**Po filmie w kursie:** `[Di] 3.5` pojedynek → `[Ei] 3.6` → quiz.

---

### 3.8 Filtry i stany · **~3 min**

**Rozdziały filmu:**

1. `filter`: `blur`, `brightness`, `contrast`, `grayscale`, `drop-shadow`
2. Łączenie wielu filtrów
3. `backdrop-filter` na półprzezroczystej nakładce
4. Zastosowanie na karcie wiadro.ai (hover preview)

**Po filmie w kursie:** `[Pg] 3.9` stany + transition + filtry.

---

### 3.11 Transformacje · **~5 min**

**Rozdziały filmu:**

1. `translate`, `scale`, `rotate`, `skew` — każda osobno
2. Łączenie transformacji
3. `transition` — płynna animacja między stanami
4. Wyśrodkowanie overlay: `top/left: 50%` + `translate(-50%, -50%)`
5. `transform` nie przesuwa sąsiadów w layoutcie (vs margin)

**Po filmie w kursie:** `[Di] 3.12` playground → `[Ec] 3.13` → `[Pg] 3.14` odtwarzacz.

---

### 3.15 Inne pseudoklasy · **~4 min**

**Rozdziały filmu:**

1. `:first-child`, `:last-child`, `:nth-child(n)`
2. `:first-of-type`, `:nth-of-type`
3. `:not()` — wykluczanie
4. `even` / `odd` — paskowanie wierszy tabeli
5. Zapowiedź tabeli porównania planów w `[Pg] 3.16`

**Po filmie w kursie:** `[Pg] 3.16` specyfikacja produktu (tabela).

---

**Moduł 3 — suma:** 5 filmów · **~22 min**

---

## Moduł 4 — Responsywne strony internetowe

### 4.1 Wprowadzenie do responsywności · **~3 min**

**Rozdziały filmu:**

1. Dlaczego strona musi działać na każdym ekranie (telefon → tablet → desktop)
2. `<meta name="viewport">` — bez tego mobile jest „mini desktopem”
3. Mobile-first vs desktop-first — strategia kursu
4. Jednostki względne zamiast sztywnych `px` w layoucie

**Po filmie w kursie:** flex responsywny → projekty RWD.

---

### 4.2 Flexbox — responsywne layouty · **~5 min**

**Rozdziały filmu:**

1. Ten sam flex na wąskim i szerokim ekranie — animacja resize viewportu
2. `flex-wrap` — karty w rzędzie → kolumna
3. Zmiana `flex-direction` na mobile
4. `flex-basis` / `grow` / `shrink` przy zmianie szerokości
5. `gap` jako odstępy niezależne od liczby elementów

**Po filmie w kursie:** `[Pg] 4.3` responsywny header i cennik.

---

### 4.5 Grid · **~10 min**

**Rozdziały filmu:**

1. Grid (2D) vs Flexbox (1D) — kiedy który
2. `display: grid`, `grid-template-columns/rows`, jednostka `fr`
3. `gap`, `grid-column/row span`, `repeat()`
4. `minmax()` — elastyczne kolumny
5. `auto-fit` / `auto-fill` — responsywny grid bez media query

**Po filmie w kursie:** `[Di] 4.6` builder → `[Pg] 4.7` sekcja funkcji.

> **YouTube:** = „CSS Grid w 10 minut”.

---

### 4.9 Media queries · **~4 min**

**Rozdziały filmu:**

1. Składnia `@media (warunek) { … }`
2. `min-width` vs `max-width` — mobile-first z `min-width`
3. Typowe breakpointy (360 / 768 / 1024 — orientacyjnie)
4. Łączenie warunków
5. Kiedy flex/grid wystarczy, a kiedy trzeba media query

**Po filmie w kursie:** `[Di] 4.10` → quiz → `[Pg] 4.12` finał wiadro.ai.

---

**Moduł 4 — suma:** 4 filmy · **~22 min**

---

## Moduł 5 — Podsumowanie i zakończenie

### 5.1 Podsumowanie kursu · **~10 min**

**Rozdziały filmu:**

1. Przelot moduł 1: CSS, kolory, typografia
2. Przelot moduł 2: box-model, flex, position, layout sklepu
3. Przelot moduł 3: selektory, stany, transformacje, tabela
4. Przelot moduł 4: RWD, grid, media queries
5. Jak te klocki składają się w gotowy landing wiadro.ai
6. Co dalej: projekt końcowy, kurs „Nowoczesny CSS”

---

### 5.4 Czym jest Figma? · **~5 min**

**Rozdziały filmu:**

1. Czym jest Figma i po co projektant devowi
2. Interfejs w pigułce: frames, warstwy, inspekcja
3. Odczyt wymiarów, kolorów, odstępów z makiety (Dev Mode / inspect)
4. Eksport zasobów (ikony, obrazki)
5. Most do `[Pk] 5.5` — sklep z wiadrami do odwzorowania

---

**Moduł 5 — suma:** 2 filmy · **~15 min**

---

## Podsumowanie

| Moduł                 | Liczba filmów |            Czas |
| --------------------- | ------------: | --------------: |
| 1 — Podstawy          |             3 |          ~7 min |
| 2 — Layout            |             8 |         ~32 min |
| 3 — Selektory i stany |             5 |         ~22 min |
| 4 — Responsywność     |             4 |         ~22 min |
| 5 — Zakończenie       |             2 |         ~15 min |
| **Razem**             |        **22** | **~1 h 38 min** |

---

## Mapowanie na YouTube (fragmenty kursu)

Filmy oznaczone poniżej mają naturalny odpowiednik w strategii YT — można je nagrać raz w pełnej wersji kursowej, potem wyciąć teaser bez `[Pg]`/`[Ec]`/`[Di]`:

| Film kursowy             | Teaser YouTube            | Docelowy czas YT |
| ------------------------ | ------------------------- | ---------------: |
| 2.18 Flexbox             | CSS Flexbox w 10 minut    |          ~10 min |
| 2.23 Position            | CSS Position w 5 minut    |           ~5 min |
| 4.5 Grid                 | CSS Grid w 5 minut        |           ~5 min |
| 1.1 + skróty modułów 2–4 | Wszystko o CSS w 10 minut |          ~10 min |

Teaser „Wszystko o CSS w 10 minut” to **montaż skrótów**, nie osobny scenariusz — unikasz dublowania pracy przy 22 filmach kursowych.

---

## Czego NIE ma w filmach `[V]`

Żeby nie kanibalizować wartości płatnego kursu i nie męczyć widza:

- **Pisanie kodu od zera** → `[Pg]`, `[Ec]`
- **Manipulacja parametrami na żywo** → `[Di]`, `[Ei]`
- **Teoria designu** (dobór palet, parowanie czcionek) → kurs „Nowoczesny CSS”
- **`:hover` / `:focus` / `:active`** — w `[Pg] 3.9`; filmy pokazują tylko zapowiedź w 3.8 / 3.11
