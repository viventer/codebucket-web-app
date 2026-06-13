# Szczegółowa specyfikacja kursu „Podstawy CSS”

> Źródło prawdy dla treści kursu. Lekki outline nawigacyjny żyje w `structure.md` i jest z tym plikiem zsynchronizowany (numeracja + zmiany strukturalne). Tutaj opisany jest **każdy element** wg stałego szablonu i zmapowany na typy z `schemas/courseSchema.ts`.

## Cel kursu i granica zakresu

To kurs **PODSTAW**. Uczy mechaniki CSS na poziomie pozwalającym zbudować prostą, statyczną, responsywną stronę. Świadomie **nie** uczy teorii projektowania.

- **Poza zakresem** (→ osobny kurs „Nowoczesny CSS”): dobieranie i parowanie czcionek, budowanie palet kolorów, zasady UX, hierarchia wizualna, design system, dostępność na poziomie audytu.
- Lekcje o kolorach i typografii ograniczają się do **mechaniki**: jakie właściwości istnieją, jaka jest składnia, jak je zastosować — nie „jak dobrać ładny zestaw”.
- **Konsekwencja dla wiadro.ai:** kursant dostaje GOTOWY brand (paleta, czcionki, tagline) i stosuje go mechanicznie. Nie uczy się go wybierać. Dzięki temu kurs nie kanibalizuje sprzedaży „Nowoczesnego CSS”.

Wyróżnik uzasadniający cenę (~100 zł): interaktywne demonstracje (`Di`) i interaktywne ćwiczenia (`Ei`) + spójny, narastający projekt + indywidualny projekt z finalnym code review.

---

# Sekcja 1 — Legenda znaczników i mapowanie na schema

| Znacznik | Znaczenie | `courseElementSchema.type` | Schemat treści | Status w modelu danych |
| --- | --- | --- | --- | --- |
| `V` | Lekcja wideo | `video` | `videoContentSchema` | ✅ wspierane |
| `Di` | Demonstracja interaktywna | — | brak | ❌ **wymaga rozszerzenia schematu** |
| `Ei` | Ćwiczenie interaktywne (drag&drop / dobierz / uzupełnij) | — | brak | ❌ **wymaga rozszerzenia schematu** |
| `Ec` | Ćwiczenie z kodem | `exercise` | `exerciseContentSchema` | ✅ wspierane |
| `Q` | Quiz | `quiz` | `quizContentSchema` | ⚠️ wspierane, ale z błędem (patrz niżej) |
| `Pg` | Projekt prowadzony (guided) — wiadro.ai | `project` | `projectContentSchema` | ✅ wspierane |
| `Pi` | Projekt indywidualny | `project` | `projectContentSchema` | ✅ (mapowany na `project`; patrz Sekcja 3) |
| `Pk` | Projekt końcowy | `finalProject` | `finalProjectSchema` | ✅ wspierane |
| `CS` | Cheatsheet (ściąga do pobrania) | — | `courseSectionSchema.cheatsheets` (array stringów) | ⚠️ częściowo — patrz niżej |

## Luki w modelu danych do rozstrzygnięcia przed wdrożeniem

1. **Brak typów `Di` i `Ei`.** `courseElementSchema.type = video | exercise | quiz | project | finalProject`. Demonstracje i ćwiczenia interaktywne — czyli główny wyróżnik produktu — **nie mają reprezentacji w schemacie**. Wymagane rozszerzenie `type` (np. `interactiveDemo`, `interactiveExercise`) wraz z dedykowanymi `contentSchema` (definicja kontrolek/stanu/warunku zaliczenia). Do tego czasu treść `Di/Ei` z tego dokumentu jest specyfikacją produktową, nie da się jej zaseedować.
2. **`quizContentSchema.questions = questionSchema` (liczba pojedyncza).** Quiz przyjmie **tylko jedno pytanie**. To niemal na pewno błąd — powinno być `z.array(questionSchema).min(1)`. Cała ta specyfikacja zakłada wiele pytań na quiz. **Do naprawienia w schemacie.**
3. **`CS` nie jest osobnym elementem.** W schemacie cheatsheety to `cheatsheets?: string[]` na poziomie sekcji, nie element w `elements[]`. Pozycja `5.2 [CS]` w outline jest więc raczej metadanymi sekcji niż elementem lekcji. Decyzja: trzymać cheatsheet jako pole sekcji modułu 5 (lub całego kursu), nie jako `courseElement`.
4. **`questionSchema.order` ma `min(0)`, ale `courseElementSchema.order` ma `min(1)`** — drobna niespójność walidacji (numeracja od 0 vs od 1). Do ujednolicenia.
5. **`Pi` i `Pg` mapują się na ten sam `type: "project"`** — model nie rozróżnia projektu prowadzonego od indywidualnego. Rozróżnienie trzeba zakodować w treści (`title`/`description`) albo dodać flagę (np. `guided: boolean`). Patrz Sekcja 3.

---

# Sekcja 2 — „Biblia” projektu prowadzonego: wiadro.ai

Spójny świat, żeby projekt `[Pg]` narastał sensownie przez cały kurs na **jednym, rosnącym** kodzie.

## Premisa (humor)

**wiadro.ai** to parodia firmy SaaS, która sprzedaje… wiadro. Fizyczne wiadro, ale „w chmurze”, z planami abonamentowymi. Płatne plany odblokowują „funkcje” wiadra:

- **Free („Dziurawe”)** — wiadro z fabryczną dziurą, „idealne do testów”. 0 zł.
- **Pro („Szczelne”)** — gwarancja braku przecieków, uchwyt premium, 12 l pojemności. 29 zł/mc.
- **Enterprise („Tytan”)** — brak rdzy na zawsze, tryb nocny wiadra (świeci w ciemności), 20 l, wsparcie 24/7. 99 zł/mc.

Ton: profesjonalny pastisz korporacyjnego marketingu SaaS (poważne nagłówki, absurdalny produkt). Humor jest tłem — celem dydaktycznym pozostaje CSS.

## Brand jako GOTOWY zestaw do stosowania

> Kursant dostaje te wartości i je **stosuje**. Nie uczymy ich dobierać (to „Nowoczesny CSS”).

**Paleta (CSS custom properties — podawane kursantowi gotowe):**

```css
:root {
  --brand-primary: #2563eb;        /* kubełkowy niebieski – główny */
  --brand-primary-dark: #1e3a8a;   /* hover/akcenty ciemne */
  --brand-accent: #f97316;         /* „antyrdzewny” pomarańcz – CTA */
  --brand-ink: #0f172a;            /* tekst nagłówków */
  --brand-text: #334155;           /* tekst treści */
  --brand-muted: #64748b;          /* tekst pomocniczy */
  --brand-bg: #f8fafc;             /* tło strony */
  --brand-surface: #ffffff;        /* tło kart */
  --brand-success: #16a34a;        /* „szczelne / dostępne” */
  --brand-border: #e2e8f0;         /* obramowania */
}
```

**Typografia (Google Fonts — gotowe):**
- Nagłówki: **Poppins** (600/700).
- Treść: **Inter** (400/500).
- Skala bazowa: `16px`, nagłówki w `rem`.

**Tagline:** „wiadro.ai — Twoje wiadro w chmurze.”
**Logo tekstowe:** `wiadro` w `--brand-ink` + `.ai` w `--brand-accent`.
**Promień zaokrągleń:** `--radius: 12px`. **Cień karty:** `0 4px 12px rgba(15,23,42,.08)`.

## Mapa akumulacji — co powstaje w którym `[Pg]`

Jeden landing SaaS budowany przyrostowo. Każdy `[Pg]` definiuje `starterCode` (poprzedni stan) i `finalCode` (nowy stan) zgodnie z `projectContentSchema`.

| `[Pg]` | Etap | Co dochodzi do kodu wiadro.ai |
| --- | --- | --- |
| 1.8 Typografia w praktyce | Fundament tekstu | Import Poppins+Inter, hierarchia nagłówków, tagline, akapity, zmienne `:root` |
| 2.6 Karta produktu | Pierwszy komponent | Karta planu „Pro”: box-model, kolory, `box-shadow`, button |
| 2.13 Ulepszona karta produktu | Wzbogacenie | Gradient na nagłówku karty, `float` przy ikonie, mocniejszy cień |
| 2.21 Strona główna sklepu | Layout poziomy | Header z logo+nav (flex), 3 karty planów obok siebie, `flex-grow` w karcie |
| 2.26 Rozwijamy nasz sklep | Pozycjonowanie | `position` headera (sticky), stopka, „badge” na karcie (np. „Najpopularniejszy” w rogu) |
| 3.2 Kombinujemy | Refaktor selektorów | Te same style przepisane na kombinatory (`>`, `+`, `~`) zamiast powtarzanych klas |
| 3.9 Stany elementów | Interakcja | `:hover/:focus/:active` na buttonach i kartach + `transition` + `filter` |
| 3.14 Ulepszony odtwarzacz | Transformacje | Sekcja „demo wiadra” z miniaturą wideo: `transform` + overlay z przyciskiem play na środku |
| 3.16 Specyfikacja produktu | Tabela | Tabela porównania planów z `:nth-child(even/odd)` i `:hover` na wierszach |
| 4.3 Responsywny header i pricing | Responsywność I | Header i cennik łamią się na mobile (flex-wrap, kolejność) |
| 4.7 Grid layout | Responsywność II | Sekcja „funkcje” jako nieregularny grid |
| 4.12 Pełna responsywność wiadro.ai | Finał guided | Media queries dla całości, breakpointy, finalny responsywny landing |

**Stan końcowy:** kompletny, responsywny landing SaaS (hero → funkcje → cennik → tabela porównania → stopka) zbudowany wyłącznie poznanymi technikami.

---

# Sekcja 3 — Tor projektu indywidualnego `[Pi]`

Dziś `[Pi]` jest rozproszony (2.7 medium społ., 2.22 cennik, 2.27 overlay, 3.8 cennik, 4.12 strona) i niespójny — różne tematy, brak ciągłości, duplikat cennika z `[Pg]`. **Przeprojektowanie: jeden projekt indywidualny, narastający przez cały kurs.**

## Zasady

- **Pełna dowolność tematu.** Kursant na starcie wybiera dowolny produkt/usługę (kawiarnia, klub, portfolio, gra, sklep z roślinami — cokolwiek). Trzyma ten sam temat do końca.
- **Każdy `[Pi]` = jedno nowe wymaganie sformułowane jako zdolność niezależna od domeny.** Nie „zrób cennik SaaS”, tylko „zrób sekcję z 3 kartami w równym rzędzie”. Dzięki temu działa dla każdego tematu i wymusza transfer wiedzy z `[Pg]` (gdzie temat jest narzucony: wiadro.ai).
- **Checklista akceptacji (samoocena)** per etap — konkretne, sprawdzalne kryteria.
- Mapuje się na `type: "project"`; w treści oznaczone jako indywidualne (sugestia: dodać `guided: false` w schemacie). `starterCode` = stan poprzedniego etapu lub pusta templatka; `finalCode` = przykładowe (jedno z możliwych) rozwiązanie referencyjne.

## Etapy (5 checkpointów, jeden rosnący projekt)

| Etap | Pozycja | Nowa zdolność (domain-agnostic) | Checklista akceptacji |
| --- | --- | --- | --- |
| **Pi-1** | 1.11 | Sekcja hero + hierarchia typografii | ☐ jeden `h1`, ☐ podtytuł, ☐ akapit opisu, ☐ min. 2 rozmiary czcionek w `rem`, ☐ własna czcionka z Google Fonts, ☐ min. 2 kolory tekstu |
| **Pi-2** | 2.22 | Sekcja z kartami w równym rzędzie (flexbox) | ☐ ≥3 karty w jednym rzędzie, ☐ box-model (padding/margin/border), ☐ `box-shadow`, ☐ równe wysokości kart, ☐ odstępy `gap`, ☐ przycisk w karcie |
| **Pi-3** | 2.27 | Element pozycjonowany nakładką (position) | ☐ kontener `position: relative`, ☐ element `absolute` (badge/overlay/etykieta), ☐ poprawny `z-index`, ☐ element trzyma się rogu/krawędzi |
| **Pi-4** | 3.10 | Stany interakcji + transformacja | ☐ `:hover` zmienia wygląd ≥2 elementów, ☐ `transition`, ☐ co najmniej jeden `transform` (scale/translate), ☐ `:focus` widoczny na elementach klikalnych |
| **Pi-5** | 4.13 | Pełna responsywność | ☐ działa od 360px do desktopu bez poziomego scrolla, ☐ ≥1 media query, ☐ karty łamią się/zmieniają układ na mobile, ☐ nawigacja użyteczna na mobile |

## Finał: zgłoszenie do code review

Ręczne code review każdego kursanta **nie skaluje się** (model biznesowy: kursy promowane przez YouTube, potencjalnie setki/tysiące kupujących). Rekomendacja:

1. **Domyślnie: review wspierane AI + rubryka samooceny.** Kursant wkleja swój kod do wbudowanego asystenta z gotowym promptem zbudowanym na rubryce (poniżej). AI ocenia po kryteriach i daje konkretne sugestie. Tanie, natychmiastowe, skalowalne.
2. **Rubryka (jednolita, 0–2 pkt każda):** poprawność HTML/CSS · zastosowanie box-model · spójność jednostek · responsywność (brak overflow) · stany interakcji · czytelność/organizacja CSS · zgodność z checklistami Pi-1…Pi-5.
3. **Opcjonalnie: ręczne review** jako płatny add-on / element wyższego planu / okresowe „office hours” — dla tych, którzy chcą ludzkiej oceny. Nie jest częścią ścieżki MVP.

> Uwaga biznesowa: ręczne review jako obietnica w cenie 100 zł to pułapka kosztowa. AI-review + rubryka chroni marżę i nadal daje odczuwalną wartość.

---

# Sekcja 4 — Dodatkowa interaktywność (`Di`/`Ei`)

Skala dobrana pod MVP — nie każdy temat dostaje nowy komponent. Dokładamy/podnosimy tam, gdzie interakcja realnie buduje intuicję, a sam film jej nie daje. Pełne specyfikacje tych elementów są w „Reszcie dokumentu”.

| Nowy/uplift | Pozycja | Typ | Po co |
| --- | --- | --- | --- |
| Live picker kolorów | 1.6 | `Di` | Zobacz na żywo różnicę hex/rgb/hsl i wpływ na element |
| Flexbox playground | 2.19 | `Ei` | Manipulacja `justify-content`/`align-items`/`flex-direction` z natychmiastowym efektem |
| Pojedynek specyficzności | 3.5 | `Di` | Dwie reguły walczą o element — widać, która i dlaczego wygrywa |
| Dobierz zwycięską regułę | 3.6 | `Ei` | Wskaż regułę, która zadziała (utrwalenie po `Di`) |
| Playground transform/transition | 3.12 | `Di` | Suwaki `rotate/scale/translate` + `transition` na żywo |
| Builder siatki grid | 4.6 | `Di` | Buduj `grid-template` klikając w komórki, podgląd kodu |

Istniejące już interaktywne: `2.5 Interaktywne pudełko` (box-model), `2.11 Edytor gradientu`, `2.14 Opływanie`, `2.24 Działanie position`, `4.10 Media queries w praktyce` oraz `Ei`: `2.9 Object-fit`, `2.25 Position`, `3.3 Pokombinuj`.

---

# Sekcja 5 — Stały szablon opisu elementu

Każdy element w „Reszcie dokumentu” opisany dokładnie tym formatem (zależnie od typu):

**`[V]` — wideo** → mapuje `videoContentSchema`
- `title`, `duration` (szac. min), **Cel**, `whatYouWillLearn` (lista), **Konspekt** (punkty), **Powiązanie z wiadro.ai**.

**`[Di]` — demo interaktywne** (brak schematu — spec produktowy)
- **Co pokazuje**, **Kontrolki** (suwaki/selecty/drag/przyciski), **Co użytkownik obserwuje**, **Aha-moment**.

**`[Ei]` — ćwiczenie interaktywne** (brak schematu — spec produktowy)
- **Zadanie**, **Mechanika** (drag&drop / dobierz wartość / uzupełnij lukę), **Stan startowy**, **Warunek zaliczenia**.

**`[Ec]` — ćwiczenie z kodem** → mapuje `exerciseContentSchema`
- `command`, `languages`, **opis `starterCode`**, **opis `solutionCode`**, `hints[]`.

**`[Q]` — quiz** → mapuje `quizContentSchema` (po naprawie: array pytań)
- Lista pytań; każde: `text`, `contentType`, 4 odpowiedzi (`id` 1–4, `type`), `correctAnswerId`, `explanation`.

**`[Pg]` — projekt prowadzony** → mapuje `projectContentSchema`
- **Increment wiadro.ai**, opis `starterCode`, opis `finalCode`, **co dochodzi**.

**`[Pi]` — projekt indywidualny** → mapuje `projectContentSchema` (`guided:false`)
- **Nowe wymaganie (domain-agnostic)** + **checklista akceptacji** (z Sekcji 3).

**`[Pk]` — projekt końcowy** → mapuje `finalProjectSchema`
- `title`, `description`, `figmaProjectUrl`, `sampleSolution`.

---

# Sekcja 6 — Trzy w pełni rozpisane wzorce (do klonowania)

Reszta elementów jest opisana wg szablonu **bez dosłownego kodu** (powstaje on z tych wzorców na etapie autorskim). Tu trzy kompletne wzorce: quiz, zadanie, demo.

## 6.1 WZORZEC QUIZ — `1.4 [Q] Podstawy działania CSS`

Mapowanie: `quizContentSchema` (zakłada **naprawiony** `questions: questionSchema[]`). Każde pytanie ma dokładnie 4 odpowiedzi (`id` 1–4), pole `explanation` na poprawnej (i opcjonalnie błędnych).

### Pytanie 1
- `text`: „Który zapis poprawnie przypisuje regułę CSS do elementu o klasie `karta`?”
- `contentType`: `"textOnly"`
- `order`: 1 · `correctAnswerId`: 2
- Odpowiedzi:
  1. `type:"code"` → `#karta { }` — *wyjaśnienie: `#` celuje w `id`, nie w klasę.*
  2. `type:"code"` → `.karta { }` — ✅ *poprawnie: `.` to selektor klasy.*
  3. `type:"code"` → `karta { }` — *wyjaśnienie: to selektor typu, szukałby tagu `<karta>`.*
  4. `type:"code"` → `*karta { }` — *wyjaśnienie: `*` to selektor uniwersalny, taki zapis jest błędny.*

### Pytanie 2
- `text`: „Dwie reguły ustawiają `color` na tym samym elemencie: jedna przez `id`, druga przez klasę. Która wygra?”
- `contentType`: `"textOnly"` · `order`: 2 · `correctAnswerId`: 1
- Odpowiedzi:
  1. `text` → „Reguła przez `id`” — ✅ *id ma wyższą specyficzność niż klasa.*
  2. `text` → „Reguła przez klasę” — *niższa specyficzność.*
  3. `text` → „Ta, która jest wyżej w pliku” — *kolejność decyduje dopiero przy równej specyficzności.*
  4. `text` → „Żadna, wystąpi błąd” — *konflikt reguł jest normalny, rozstrzyga go kaskada.*

### Pytanie 3
- `text`: „Co zrobi właściwość `font-size: 2rem`, jeśli bazowy rozmiar to 16px?”
- `contentType`: `"textOnly"` · `order`: 3 · `correctAnswerId`: 3
- Odpowiedzi:
  1. `text` → „Ustawi 2px” — *`rem` to nie piksele.*
  2. `text` → „Ustawi 20px” — *to byłoby 1.25rem.*
  3. `text` → „Ustawi 32px” — ✅ *`2 × 16px = 32px`; `rem` mnoży rozmiar bazowy.*
  4. `text` → „Zależy od rodzica” — *to zachowanie `em`, nie `rem`.*

### Pytanie 4
- `text`: „Która właściwość dziedziczy się domyślnie na elementy potomne?”
- `contentType`: `"textOnly"` · `order`: 4 · `correctAnswerId`: 4
- Odpowiedzi:
  1. `text` → „`margin`” — *nie dziedziczy się.*
  2. `text` → „`border`” — *nie dziedziczy się.*
  3. `text` → „`padding`” — *nie dziedziczy się.*
  4. `text` → „`color`” — ✅ *właściwości tekstu (`color`, `font-family`) dziedziczą się domyślnie.*

## 6.2 WZORZEC ZADANIE — `1.3 [Ec] Twój pierwszy kod CSS`

Mapowanie: `exerciseContentSchema`.

- `command`: „Ostyluj nagłówek i akapit wizytówki wiadro.ai: nadaj nagłówkowi klasy `tytul` kolor `#2563eb` i rozmiar `32px`, a akapitowi klasy `opis` kolor `#334155`. Tło całej strony ustaw na `#f8fafc`.”
- `languages`: `["html", "css"]`

**`starterCode` (dosłownie):**

```html
<!-- index.html -->
<body>
  <h1 class="tytul">wiadro.ai</h1>
  <p class="opis">Twoje wiadro w chmurze.</p>
</body>
```

```css
/* styles.css */
/* Tu wpisz swoje style */
```

**`solutionCode` (dosłownie):**

```html
<!-- index.html (bez zmian) -->
<body>
  <h1 class="tytul">wiadro.ai</h1>
  <p class="opis">Twoje wiadro w chmurze.</p>
</body>
```

```css
/* styles.css */
body {
  background-color: #f8fafc;
}

.tytul {
  color: #2563eb;
  font-size: 32px;
}

.opis {
  color: #334155;
}
```

**`hints[]`:**
1. „Selektor klasy zaczyna się od kropki: `.tytul { }`.”
2. „Tło ustawisz właściwością `background-color` na selektorze `body`.”
3. „Rozmiar tekstu to `font-size`, kolor to `color`. Pamiętaj o jednostce `px`.”

## 6.3 WZORZEC DEMO — `2.5 [Di] Interaktywne pudełko (box-model)`

Brak schematu (spec produktowy do rozszerzenia modelu).

- **Co pokazuje:** jeden centralny `<div>` („wiadro”) z widocznymi warstwami box-model — treść, `padding`, `border`, `margin` — każda w innym kolorze (jak w devtools).
- **Kontrolki:**
  - 4 suwaki `padding` (góra/prawo/dół/lewo) 0–60px, z opcją „zsynchronizuj wszystkie”.
  - Suwak `border-width` 0–20px + select `border-style` (solid/dashed/dotted) + color picker obramowania.
  - 4 suwaki `margin` 0–60px.
  - Przełącznik `box-sizing`: `content-box` ↔ `border-box`.
  - Pole tekstowe „treść” (zmienia ilość contentu, by pokazać rozpychanie).
  - Przycisk „Reset”.
- **Co użytkownik obserwuje:** na żywo zmienia się rozmiar i odstępy pudełka; obok wyświetla się **wygenerowany kod CSS** oraz **realna szerokość elementu** (computed width).
- **Aha-moment:** przy `content-box` ustawienie `width: 200px` + `padding: 20px` + `border: 5px` daje realne **250px**; po przełączeniu na `border-box` realna szerokość wraca do **200px**. Widać, dlaczego `box-sizing: border-box` upraszcza layout.

---

# Reszta dokumentu — pełny opis elementów modułów 1–5

> Numeracja jest źródłem prawdy (zsynchronizowana z `structure.md`). Elementy oznaczone **(NOWY)** dochodzą względem pierwotnego outline. Elementy `[Pi]` opisane skrótowo — pełna treść w Sekcji 3.

## Moduł 1 — Podstawy

### 1.1 `[V]` Wprowadzenie do CSS
- **Cel:** zrozumieć, czym jest CSS i jak podpiąć style do HTML.
- `whatYouWillLearn`: czym jest CSS · trzy sposoby dołączania CSS (inline/internal/external) · selektor klasy i id · priorytet (specyficzność w pigułce) · dziedziczenie · `font-size` i `color` jako pierwsze właściwości.
- **Konspekt:** rola CSS względem HTML → `<link>` do `styles.css` → reguła = selektor + blok `{ }` → klasa (`.`) vs id (`#`) → co wygrywa przy konflikcie (intuicja) → co to dziedziczenie → demo na `color`/`font-size`.
- **Powiązanie z wiadro.ai:** pierwszy stylowany element to logo „wiadro.ai”.

### 1.2 `[Di]` Jak działa CSS?
- **Co pokazuje:** podsumowanie modułu wstępnego — żywe powiązanie HTML↔CSS.
- **Kontrolki:** dodaj/usuń klasę elementowi (toggle), zamień klasę na id (przełącznik), dołóż drugi element dziedziczący po rodzicu.
- **Co użytkownik obserwuje:** element zmienia wygląd, gdy dostaje klasę; przy id reguła „przebija” klasę; potomek przejmuje `color` po rodzicu.
- **Aha-moment:** „styl nie jest przyklejony do elementu — wynika z reguł, ich specyficzności i dziedziczenia”.

### 1.3 `[Ec]` Twój pierwszy kod CSS
- **WZORZEC — pełna treść w Sekcji 6.2.** Mapowanie: `exerciseContentSchema`.

> ----------------------- REJESTRACJA -----------------------

### 1.4 `[Q]` Podstawy działania CSS
- **WZORZEC — pełna treść w Sekcji 6.1.** Mapowanie: `quizContentSchema` (po naprawie array pytań).

### 1.5 `[V]` Kolory w CSS
- **Cel:** poznać mechanikę zapisu koloru (bez teorii doboru palet).
- `whatYouWillLearn`: `color` vs `background-color` · formaty: nazwa / hex / `rgb()` / `rgba()` / `hsl()` · przezroczystość (`rgba`, `opacity`) · kiedy który zapis jest wygodny.
- **Konspekt:** nazwy kolorów → hex (3 i 6 znaków) → rgb/rgba → hsl → alfa/przezroczystość → praktyczne: kopiowanie hexów z gotowego brandu.
- **Powiązanie z wiadro.ai:** wprowadzenie zmiennych `--brand-*` jako „gotowej palety do wklejania”.

### 1.6 `[Di]` Live picker kolorów **(NOWY)**
- **Co pokazuje:** jeden element (przycisk „Kup wiadro”) i trzy równoważne zapisy tego samego koloru.
- **Kontrolki:** picker koloru + przełącznik formatu hex/rgb/hsl (pokazuje ten sam kolor w trzech składniach) + suwak alfa.
- **Co użytkownik obserwuje:** zmiana koloru tła/tekstu na żywo; ten sam kolor zapisany trzema sposobami; alfa odsłania tło.
- **Aha-moment:** „hex, rgb i hsl to ten sam kolor zapisany inaczej — wybór to wygoda, nie efekt”.

### 1.7 `[V]` Czcionka w CSS
- **Cel:** mechanika stylowania tekstu.
- `whatYouWillLearn`: `font-family` i fallbacki · `font-size` · `font-weight` · `font-style` · `text-decoration` · `line-height` · `text-align` · zawijanie (`white-space`, `overflow-wrap`) · rola `<span>` do stylowania fragmentu.
- **Konspekt:** stos czcionek i fallback → rozmiar/grubość/styl → dekoracje → wyrównanie i interlinia → zawijanie długich słów → stylowanie fragmentu przez `<span>`.
- **Powiązanie z wiadro.ai:** zapowiedź użycia Poppins/Inter w `[Pg] 1.8`.

### 1.8 `[Pg]` Typografia w praktyce
- **Increment wiadro.ai:** fundament tekstowy landingu.
- **`starterCode`:** czysty HTML wizytówki (logo, tagline, 2 akapity) bez stylów + pusty `:root`.
- **`finalCode`:** import Poppins+Inter z Google Fonts, `:root` z `--brand-*`, hierarchia (`h1`/`h2`/akapit), tagline z kolorowym `.ai`, ustalona interlinia i wyrównanie.
- **Co dochodzi:** czcionki Google Fonts, zmienne brandu, hierarchia typografii.

### 1.9 `[Di]` Podsumowanie informacji o typografii
- **Co pokazuje:** jeden blok tekstu z panelem właściwości typografii.
- **Kontrolki:** selecty `font-weight`/`font-style`/`text-align`, suwaki `font-size`/`line-height`, toggle `text-decoration`.
- **Co użytkownik obserwuje:** tekst reaguje na każdą zmianę; obok generuje się kod.
- **Aha-moment:** „hierarchię buduję kombinacją rozmiaru, grubości i interlinii — to mechanika, nie magia”.

### 1.10 `[Ec]` Stwórz profesjonalny layout tekstu
- `command`: „Z gotowego HTML (tytuł, lead, 2 akapity) zbuduj czytelną hierarchię: nagłówek 40px/bold, lead 20px/szary, akapity 16px z interlinią 1.6.”
- `languages`: `["html","css"]`
- **`starterCode`:** HTML z 4 blokami tekstu, pusty CSS.
- **`solutionCode`:** reguły `font-size`/`font-weight`/`color`/`line-height` na klasach.
- `hints[]`: „interlinia to `line-height`” · „lead odróżnij kolorem i rozmiarem” · „`rem`/`px` — trzymaj jedną jednostkę”.

### 1.11 `[Pi]` Twój projekt — etap 1: hero + typografia
- **Nowe wymaganie:** sekcja hero wybranego tematu z hierarchią typografii. Mapowanie `project` (`guided:false`).
- **Checklista (Pi-1):** patrz Sekcja 3 (h1, podtytuł, akapit, ≥2 rozmiary w `rem`, czcionka Google Fonts, ≥2 kolory tekstu).

### 1.12 `[Q]` Typografia i kolory w CSS
- 4 pytania, `quizContentSchema`. Tematy: różnica `color`/`background-color`; co robi `font-weight: 700`; który zapis koloru ma przezroczystość (`rgba`); co ustawia `line-height`. Każde 4 odpowiedzi + wyjaśnienia.

## Moduł 2 — Layout strony internetowej

### 2.1 `[V]` Elementy blokowe i inline
- **Cel:** zrozumieć typy wyświetlania i wymiary.
- `whatYouWillLearn`: `div` vs `span` · `width`/`height` · `min/max-width/height` · `display: inline | block | inline-block` · `display:none` vs `visibility:hidden`.
- **Konspekt:** blok bierze całą szerokość, inline tylko treść → wymiary nie działają na czysty inline → `inline-block` jako kompromis → ukrywanie: brak w layoucie vs niewidoczny ale zajmuje miejsce.
- **Powiązanie:** przygotowanie do układania kart wiadro.ai.

### 2.2 `[Di]` Display w praktyce
- **Co pokazuje:** `div` i `span` z tym samym CSS.
- **Kontrolki:** select `display`, suwaki `width`/`height`.
- **Co użytkownik obserwuje:** `width`/`height` ignorowane przy `inline`, działają przy `block`/`inline-block`.
- **Aha-moment:** „dlaczego span nie chce mieć szerokości”.

### 2.3 `[Ec]` Kolorowe blocki
- `command`: „Ułóż kolorowe bloki: dwa obok siebie, jeden pełnej szerokości pod spodem; użyj `width`, `height`, `display`.”
- `languages`: `["html","css"]` · **starter:** 3 divy bez stylu · **solution:** `inline-block`/`block` + wymiary · `hints[]`: „`inline-block` ustawia elementy w rzędzie” · „blok bierze 100% szerokości” · „odstępy zrobisz marginesem”.

### 2.4 `[V]` CSS box-model
- **Cel:** zrozumieć model pudełkowy.
- `whatYouWillLearn`: `content`/`padding`/`border`/`margin` · jak liczona jest szerokość · problem domyślnego `content-box` · rozwiązanie `box-sizing: border-box`.
- **Konspekt:** warstwy pudełka → padding rozpycha od środka → border → margin jako odstęp zewnętrzny → pułapka sumowania szerokości → globalny `* { box-sizing: border-box }`.

### 2.5 `[Di]` Interaktywne pudełko
- **WZORZEC — pełna treść w Sekcji 6.3.**

### 2.6 `[Pg]` Karta produktu
- **Increment wiadro.ai:** pierwszy komponent — karta planu „Pro”.
- **`starterCode`:** typografia z 1.8.
- **`finalCode`:** karta (`.plan-card`) z paddingiem, `border`, `border-radius`, `box-shadow`, nagłówkiem planu, ceną, listą cech, buttonem CTA w `--brand-accent`.
- **Co dochodzi:** box-model w praktyce, `box-shadow`, stylowanie przycisku.

### 2.7 `[Ec]` Box-model w praktyce
- `command`: „Odwzoruj wygląd elementu docelowego, dobierając `padding`, `border` i `margin`; ustaw `box-sizing: border-box`.”
- `languages`: `["html","css"]` · **starter:** element bez odstępów · **solution:** dobrane wartości · `hints[]`: „zacznij od `border-box`” · „padding to odstęp wewnętrzny” · „margin to odstęp między elementami”.

> ----------------------- PAYWALL -----------------------

### 2.8 `[V]` Stylowanie zdjęć
- `whatYouWillLearn`: `object-fit` (`cover`/`contain`/`fill`) · `background-image` · `background-size`/`position`/`repeat` · różnica `<img>` vs tło.
- **Konspekt:** kontrola proporcji `object-fit` → kadrowanie `cover` → tło CSS i jego dopasowanie → kiedy `<img>`, kiedy tło. **Powiązanie:** zdjęcie wiadra w karcie.

### 2.9 `[Ei]` Object-fit w praktyce
- **Zadanie:** dobierz wartość `object-fit` do oczekiwanego efektu na 3 obrazkach.
- **Mechanika:** dobierz wartość z listy do każdego obrazka.
- **Stan startowy:** zniekształcone obrazki. **Warunek zaliczenia:** wszystkie 3 dopasowania poprawne.

### 2.10 `[V]` Gradienty w CSS
- `whatYouWillLearn`: `linear-gradient` · `radial-gradient` · wiele stopni koloru · kąt · gradient jako `background`.
- **Konspekt:** składnia `linear-gradient(kąt, kolor1, kolor2)` → stopnie procentowe → radial → użycie w tle nagłówka karty. **Powiązanie:** nagłówek karty „Enterprise”.

### 2.11 `[Di]` Edytor gradientu
- **Co pokazuje:** podgląd prostokąta z gradientem.
- **Kontrolki:** typ (linear/radial), suwak kąta, dodawanie/usuwanie color-stopów, pickery kolorów.
- **Obserwacja:** żywy gradient + generowany kod do skopiowania. **Aha-moment:** „gradient to wartość tła, nie osobny element”.

### 2.12 `[Ec]` Odwzoruj gradient
- `command`: „Odtwórz gradient z obrazka docelowego (kierunek, kolory, stopnie).” `languages`: `["css"]` · **starter:** element bez tła · **solution:** `linear-gradient(...)` · `hints[]`: „kąt w deg” · „kolejność kolorów = kierunek” · „stopnie w %”.

### 2.13 `[Pg]` Ulepszona karta produktu
- **Increment:** gradient + float + cień.
- **`starterCode`:** karta z 2.6. **`finalCode`:** gradientowy nagłówek karty, ikona „opływana” tekstem (`float`), mocniejszy `box-shadow`. **Co dochodzi:** `linear-gradient`, `float`, refinement cienia.

### 2.14 `[Di]` Opływanie (float)
- **Co pokazuje:** akapit z elementem (ikoną/obrazkiem) w środku.
- **Kontrolki:** select `float` (`none`/`left`/`right`), suwak `margin`, toggle `clear`.
- **Obserwacja:** tekst opływa element; `clear` przerywa opływanie. **Aha-moment:** „float wyjmuje element z normalnego flow, a tekst się wokół układa”.

### 2.15 `[V]` Jednostki w CSS
- `whatYouWillLearn`: `px` vs `rem` vs `em` vs `%` · `vw`/`vh` (wzmianka) · kiedy której użyć w layoucie.
- **Konspekt:** `px` absolutne → `rem` względem root → `em` względem rodzica (pułapka kaskady) → `%` względem kontenera → praktyka: rozmiary tekstu w `rem`, layout w `%`/`rem`.

### 2.16 `[Q]` Poprawne dobieranie jednostek w CSS
- 4 pytania: różnica `rem`/`em`; ile to `1.5rem` przy 16px; `%` względem czego; którą jednostkę do skalowalnego tekstu. 4 odpowiedzi + wyjaśnienia.

### 2.17 `[V]` Overflow
- `whatYouWillLearn`: `overflow: visible|hidden|scroll|auto` · `overflow-x/y` · kiedy pojawia się scroll · przycinanie treści.
- **Konspekt:** co się dzieje, gdy treść nie mieści się w kontenerze → `hidden` przycina → `auto` daje scroll w razie potrzeby. **Powiązanie:** przewijalna lista cech planu.

### 2.18 `[V]` Flexbox
- **Cel:** budowa układów jednowymiarowych.
- `whatYouWillLearn`: `display:flex` · `flex-direction` · `justify-content` · `align-items` · `gap` · `flex-wrap` · `flex-grow/shrink/basis` · zagnieżdżanie flexów.
- **Konspekt:** kontener vs elementy → oś główna i poprzeczna → rozkład wzdłuż osi → wyrównanie w poprzek → zawijanie → elastyczność elementów → flex w flexie.

### 2.19 `[Ei]` Flexbox playground **(NOWY)**
- **Zadanie:** ustaw wiadra w wskazanych miejscach kontenera, manipulując właściwościami flex.
- **Mechanika:** selecty `justify-content`/`align-items`/`flex-direction` + toggle `flex-wrap`; cel rysowany jako „ghost” pozycje.
- **Stan startowy:** wiadra w lewym górnym rogu. **Warunek zaliczenia:** wiadra trafiają w docelowe pozycje (kilka poziomów: center, space-between, kolumna).

### 2.20 `[Ec]` Ustawianie wiader — flexbox w praktyce
- `command`: „Wykorzystaj `align-items` i `justify-content`, by ustawić wiadra zgodnie z obrazkiem docelowym.” `languages`: `["html","css"]` · **starter:** kontener z wiadrami bez flex · **solution:** `display:flex` + wyrównania · `hints[]`: „oś główna = `justify-content`” · „oś poprzeczna = `align-items`” · „odstępy = `gap`”.

### 2.21 `[Pg]` Strona główna sklepu internetowego
- **Increment:** layout poziomy.
- **`starterCode`:** karty z 2.13. **`finalCode`:** header (logo + nav we flex), 3 karty planów w rzędzie (`gap`), przycisk obok tekstu, `flex-grow` wyrównujące wysokości, zagnieżdżony flex w karcie. **Co dochodzi:** flexbox layout, header, `flex-grow`, nested flex.

### 2.22 `[Pi]` Twój projekt — etap 2: karty w równym rzędzie
- **Nowe wymaganie:** sekcja z ≥3 kartami w jednym rzędzie (flexbox), box-model, cień, równe wysokości. **Checklista (Pi-2)** — Sekcja 3.

### 2.23 `[V]` Pozycjonowanie elementów na stronie
- `whatYouWillLearn`: `position: static|relative|absolute|fixed|sticky` · `top/right/bottom/left` · `z-index` i konteksty nakładania.
- **Konspekt:** `relative` jako punkt odniesienia → `absolute` względem przodka pozycjonowanego → `fixed`/`sticky` → warstwy `z-index`.

### 2.24 `[Di]` Działanie position w praktyce
- **Co pokazuje:** kontener z elementem do pozycjonowania.
- **Kontrolki:** select `position`, suwaki `top/left`, suwak `z-index`, toggle „rodzic relative”.
- **Obserwacja:** element skacze względem różnych odniesień; `z-index` zmienia warstwę. **Aha-moment:** „`absolute` liczy się od najbliższego pozycjonowanego rodzica”.

### 2.25 `[Ei]` Jak position wpływa na ustawienie elementu
- **Zadanie:** przyporządkuj kod (`position` + offsety) do obrazka ustawienia elementu.
- **Mechanika:** dopasowanie kod↔wynik (matching).
- **Stan startowy:** 4 warianty kodu, 4 obrazki. **Warunek zaliczenia:** wszystkie pary poprawne.

### 2.26 `[Pg]` Rozwijamy nasz sklep
- **Increment:** pozycjonowanie.
- **`starterCode`:** strona z 2.21. **`finalCode`:** sticky header, stopka, badge „Najpopularniejszy” (`absolute`) w rogu karty „Pro”, `z-index`. **Co dochodzi:** `position`, `sticky`, `z-index`, stopka.

### 2.27 `[Pi]` Twój projekt — etap 3: element nakładką
- **Nowe wymaganie:** dodaj element pozycjonowany nakładką (badge/overlay/etykieta) z `relative`+`absolute`+`z-index`. **Checklista (Pi-3)** — Sekcja 3.

## Moduł 3 — Zaawansowane selektory, stany i transformacje

### 3.1 `[V]` Kombinatory
- `whatYouWillLearn`: potomek (spacja) · dziecko (`>`) · rodzeństwo sąsiednie (`+`) · rodzeństwo ogólne (`~`) · grupowanie (`,`).
- **Konspekt:** demonstracja każdego kombinatora na uproszczonym drzewie HTML; kiedy który celuje precyzyjniej niż klasa.

### 3.2 `[Pg]` Kombinujemy
- **Increment:** refaktor selektorów.
- **`starterCode`:** kod sklepu z 2.26 z powtarzanymi klasami. **`finalCode`:** te same style przepisane na kombinatory (`.nav > a`, `.card + .card`, itp.). **Co dochodzi:** czystsze selektory bez nowego wyglądu.

### 3.3 `[Ei]` Pokombinuj
- **Zadanie:** uzupełnij luki w selektorach odpowiednim kombinatorem, by strona wyglądała jak docelowa.
- **Mechanika:** uzupełnij lukę (wybór kombinatora z palety).
- **Stan startowy:** selektory z dziurami, podgląd „rozjechany”. **Warunek zaliczenia:** podgląd zgodny z docelowym.

### 3.4 `[V]` Specyficzność i kaskada — dokładne wyjaśnienie
- `whatYouWillLearn`: punktacja specyficzności (inline/id/klasa/typ) · kaskada i kolejność · `!important` (i czemu unikać) · jak debugować konflikt reguł.
- **Konspekt:** liczenie specyficzności krok po kroku → remis rozstrzyga kolejność → `!important` jako ostateczność → odczyt w devtools.

### 3.5 `[Di]` Pojedynek specyficzności **(NOWY)**
- **Co pokazuje:** jeden element atakowany przez 2–3 reguły o różnej specyficzności.
- **Kontrolki:** włączaj/wyłączaj reguły, zmieniaj selektor (typ→klasa→id), toggle `!important`.
- **Obserwacja:** licznik specyficzności dla każdej reguły + podświetlenie zwycięskiej; element zmienia kolor zgodnie z wygraną. **Aha-moment:** „wygrywa wyższa specyficzność, a przy remisie — późniejsza reguła”.

### 3.6 `[Ei]` Dobierz zwycięską regułę **(NOWY)**
- **Zadanie:** dla podanego elementu i zestawu reguł wskaż, która zadziała.
- **Mechanika:** wybór jednej z reguł (single choice na żywym przykładzie).
- **Stan startowy:** 3 reguły konkurujące. **Warunek zaliczenia:** poprawny wybór w serii 4 przypadków o rosnącej trudności.

### 3.7 `[Q]` Specyficzność
- 4 pytania typu „który styl przeważy”: id vs klasa; dwie klasy vs jedna; rola `!important`; remis i kolejność. 4 odpowiedzi + wyjaśnienia.

### 3.8 `[V]` Filtry
- `whatYouWillLearn`: `filter` (`blur`/`brightness`/`contrast`/`grayscale`/`drop-shadow`) · `backdrop-filter` · łączenie filtrów.
- **Konspekt:** każdy filtr na przykładzie obrazka wiadra → łączenie wielu → `backdrop-filter` na nakładce. **Powiązanie:** efekt na kartach.

### 3.9 `[Pg]` Stany elementów
- **Increment:** interakcja.
- **`starterCode`:** sklep z 3.2. **`finalCode`:** `:hover/:focus/:active` na buttonach i kartach, `transition` płynne, filtr (np. `brightness`) na hover karty. **Co dochodzi:** pseudoklasy stanów, `transition`, filtry w interakcji.

### 3.10 `[Pi]` Twój projekt — etap 4: stany interakcji
- **Nowe wymaganie:** dodaj stany `:hover`/`:focus` + `transition` + min. jeden `transform`. **Checklista (Pi-4)** — Sekcja 3.

### 3.11 `[V]` Transformacje
- `whatYouWillLearn`: `transform: translate/scale/rotate/skew` · łączenie z `transition` · wyśrodkowanie elementu techniką `top/left:50% + translate(-50%,-50%)`.
- **Konspekt:** każda transformacja osobno → łączenie → animowanie przez `transition` → klasyczne centrowanie overlay.

### 3.12 `[Di]` Playground transform/transition **(NOWY)**
- **Co pokazuje:** element reagujący na transformacje.
- **Kontrolki:** suwaki `rotate`/`scale`/`translateX/Y`/`skew`, suwak `transition-duration`, select `transition-timing-function`.
- **Obserwacja:** element transformuje się płynnie wg ustawień; obok generowany kod. **Aha-moment:** „`transform` nie rusza layoutu sąsiadów, a `transition` decyduje o płynności”.

### 3.13 `[Ec]` Murarz, tynkarz, akrobata
- `command`: „Po kliknięciu przycisku ludzik wykonuje akrobacje — odwzoruj zadane pozy/ruchy za pomocą `transform` i `transition`.” `languages`: `["html","css"]` · **starter:** ludzik + przycisk, brak transformacji · **solution:** klasy z `transform` + `transition` · `hints[]`: „obrót to `rotate`” · „skok to `translateY`” · „płynność to `transition`”.

### 3.14 `[Pg]` Ulepszony odtwarzacz
- **Increment:** transformacje + overlay.
- **`starterCode`:** sklep z 3.9. **`finalCode`:** sekcja „demo wiadra” z miniaturą wideo; po `:hover` pojawia się przyciemniony overlay z przyciskiem play wyśrodkowanym przez `transform`. **Co dochodzi:** overlay, centrowanie transformem, interakcja hover.

### 3.15 `[V]` Inne pseudoklasy
- `whatYouWillLearn`: `:first-child`/`:last-child`/`:nth-child`/`:first-of-type`/`:nth-of-type` · `:not()` · `even`/`odd`.
- **Konspekt:** na liście i akapitach pokazać celowanie w pozycje; `nth-child(2n)` itd.

### 3.16 `[Pg]` Specyfikacja produktu
- **Increment:** tabela.
- **`starterCode`:** sklep z 3.14. **`finalCode`:** tabela porównania planów z `:nth-child(even/odd)` (paskowanie wierszy) i `:hover` podświetlającym wiersz. **Co dochodzi:** stylowanie tabel, pseudoklasy strukturalne.

## Moduł 4 — Responsywne strony internetowe

### 4.1 `[V]` Wprowadzenie do responsywności
- `whatYouWillLearn`: czym jest RWD · viewport meta · mobile-first vs desktop-first · jednostki względne w RWD.
- **Konspekt:** dlaczego strona musi działać na każdym ekranie → `<meta viewport>` → strategia mobile-first → unikanie sztywnych `px` w layoucie.

### 4.2 `[V]` Flexbox — responsywne layouty
- `whatYouWillLearn`: `flex-wrap` w RWD · `flex-basis`/`grow`/`shrink` przy zmianie szerokości · zmiana `flex-direction` na mobile · `gap`.
- **Konspekt:** jak ten sam flex łamie się na mobile → karty w rzędzie → kolumna na wąskim ekranie.

### 4.3 `[Pg]` Responsywny header i pricing
- **Increment:** responsywność I.
- **`starterCode`:** sklep z 3.16. **`finalCode`:** header i cennik łamią się na mobile (flex-wrap, zmiana kierunku, kolejność). **Co dochodzi:** responsywne zachowanie kluczowych sekcji.

### 4.4 `[Ec]` Odwzoruj responsywny układ
- `command`: „Ostyluj uproszczony układ bloków tak, by zmieniał się z rzędu (desktop) na kolumnę (mobile) bez media query — używając flex-wrap.” `languages`: `["html","css"]` · **starter:** bloki w sztywnym rzędzie · **solution:** `flex-wrap` + `min-width` · `hints[]`: „`flex-wrap: wrap`” · „`min-width` wymusza zawijanie” · „`flex-basis` ustala bazę”.

### 4.5 `[V]` Grid
- `whatYouWillLearn`: `display:grid` · `grid-template-columns/rows` · `fr` · `gap` · `grid-column/row` span · `repeat()`/`minmax()` · `auto-fit`/`auto-fill`.
- **Konspekt:** siatka dwuwymiarowa vs flex jednowymiarowy → definiowanie kolumn → rozpinanie komórek → responsywny grid z `auto-fit minmax`.

### 4.6 `[Di]` Builder siatki grid **(NOWY)**
- **Co pokazuje:** edytowalna siatka.
- **Kontrolki:** liczba kolumn/wierszy, rozmiary tracków (`fr`/`px`/`minmax`), `gap`, klikanie komórek by rozpiąć element (`span`).
- **Obserwacja:** żywa siatka + generowany `grid-template`. **Aha-moment:** „`fr` dzieli dostępną przestrzeń proporcjonalnie; `minmax` daje responsywność bez media query”.

### 4.7 `[Pg]` Grid layout
- **Increment:** responsywność II.
- **`starterCode`:** sklep z 4.3. **`finalCode`:** sekcja „funkcje” jako nieregularny grid (`grid-template-areas`/`span`), responsywny przez `auto-fit minmax`. **Co dochodzi:** layout gridowy.

### 4.8 `[Ec]` Odwzoruj układ bloków
- `command`: „Za pomocą Grid odwzoruj nieregularny układ z obrazka (różne szerokości kolumn i rozpięte komórki).” `languages`: `["html","css"]` · **starter:** bloki bez grid · **solution:** `grid-template-columns` + `grid-column: span` · `hints[]`: „`repeat(3, 1fr)`” · „rozpięcie = `grid-column: span 2`” · „odstępy = `gap`”.

### 4.9 `[V]` Media queries
- `whatYouWillLearn`: składnia `@media` · `min-width`/`max-width` · breakpointy · łączenie warunków · mobile-first z `min-width`.
- **Konspekt:** kiedy flex/grid nie wystarczą → progi breakpointów → nadpisywanie reguł od konkretnej szerokości.

### 4.10 `[Di]` Media queries w praktyce
- **Co pokazuje:** podgląd strony w zmiennej szerokości viewportu.
- **Kontrolki:** suwak szerokości ekranu, wskaźnik aktywnego breakpointu, lista reguł `@media`.
- **Obserwacja:** layout przełącza się przy przekroczeniu progu; aktywna reguła podświetlona. **Aha-moment:** „media query to po prostu zestaw reguł włączany od danej szerokości”.

### 4.11 `[Q]` Zweryfikuj wiedzę na temat responsywności
- 4 pytania: `min-width` vs `max-width`; co robi `1fr`; po co `<meta viewport>`; kiedy flex-wrap wystarcza zamiast media query. 4 odpowiedzi + wyjaśnienia.

### 4.12 `[Pg]` Pełna responsywność wiadro.ai
- **Increment:** finał guided.
- **`starterCode`:** sklep z 4.7. **`finalCode`:** media queries dla całego landingu (hero, funkcje, cennik, tabela, stopka), spójne breakpointy, brak poziomego scrolla od 360px. **Co dochodzi:** kompletny responsywny landing SaaS — stan końcowy projektu prowadzonego.

### 4.13 `[Pi]` Twój projekt — etap 5: pełna responsywność + code review
- **Nowe wymaganie:** doprowadź własny projekt do pełnej responsywności (≥1 media query, brak overflow od 360px). **Checklista (Pi-5)** — Sekcja 3.
- **Finał:** zgłoszenie do code review (AI + rubryka domyślnie; ręczne opcjonalnie) — szczegóły w Sekcji 3.

## Moduł 5 — Podsumowanie i zakończenie

### 5.1 `[V]` Podsumowanie kursu
- **Cel:** szybki przegląd całości.
- `whatYouWillLearn`: mapa wszystkich tematów · jak łączą się w realny projekt · co dalej.
- **Konspekt:** przelot przez moduły 1–4 z odniesieniem do zbudowanego landingu wiadro.ai.

### 5.2 `[CS]` CSS cheatsheet
- **Uwaga schema:** nie jest `courseElement`; mapuje `courseSectionSchema.cheatsheets: string[]` (linki do plików do pobrania). Zawartość: ściągi z selektorów, box-model, flexbox, grid, media queries, pseudoklas, transform/transition.

### 5.3 `[Q]` Sprawdź swoją wiedzę na temat CSS
- Quiz końcowy (np. 6–8 pytań po naprawie schematu) z przekrojem całego kursu: selektory, box-model, flex, grid, position, specyficzność, RWD. 4 odpowiedzi + wyjaśnienia każde.

### 5.4 `[V]` Czym jest Figma?
- **Cel:** wprowadzenie do Figmy potrzebne do projektu końcowego.
- `whatYouWillLearn`: czym jest Figma · jak odczytać wymiary/kolory/odstępy z projektu · tryb inspekcji.
- **Konspekt:** interfejs w pigułce → odczyt wartości CSS z makiety → eksport zasobów.

### 5.5 `[Pk]` Projekt końcowy — sklep z wiadrami
- **Mapowanie:** `finalProjectSchema`.
- `title`: „Sklep z wiadrami — projekt końcowy”. `description`: odwzoruj samodzielnie kompletny projekt z makiety Figma, stosując wszystkie poznane techniki. `figmaProjectUrl`: makieta do odwzorowania. `sampleSolution`: referencyjny kod HTML/CSS (jeden z możliwych).
- **Zakres:** integruje box-model, flex, grid, position, stany, RWD; brak nowych pojęć — to sprawdzian transferu.

---

## Załącznik — podsumowanie zmian strukturalnych względem pierwotnego outline

- **Ujednolicony `[Pi]`:** 5 rozproszonych projektów (2.7, 2.22, 2.27, 3.8, 4.12) → jeden projekt indywidualny w 5 etapach (1.11, 2.22, 2.27, 3.10, 4.13) o wymaganiach niezależnych od tematu + finalne code review.
- **Nowe interaktywne:** `1.6 [Di]` live picker kolorów, `2.19 [Ei]` flexbox playground, `3.5 [Di]` pojedynek specyficzności, `3.6 [Ei]` dobierz regułę, `3.12 [Di]` playground transform/transition, `4.6 [Di]` builder grid.
- **Przeniesienia:** dawne `2.8 [Ec] Box-model w praktyce` → `2.7`; `3.5 [Q] Specyficzność` → `3.7` (po wstawieniu Di/Ei specyficzności).
- **Do naprawy w schemacie przed wdrożeniem:** typy `Di`/`Ei`; `quizContentSchema.questions` → array; ujednolicenie `order`; rozróżnienie `Pg`/`Pi`.
