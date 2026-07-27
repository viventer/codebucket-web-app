Wygląd landingu kursu ma zmieniać się w zależności od tego czy user wykupił/rozpoczął dany kurs.

# Opcje statusu kursu

a. User nie rozpoczął darmowego kursu.
b. User rozpoczął kurs, ale go nie ukończył.
c. User ukończył kurs.
d. User nie wykupił płatnego kursu w przedsprzedaży.
e. User wykupił płatny kurs, kurs jest nadal w przedsprzedaży (nie jest jeszcze dostępny).

Litery w planie poniżej odnoszą się do tych opcji.

## Layout

Layout pozostaje taki sam niezależnie od statusu kursu. Co sprawia, że skeleton nie musi się zmieniać i nie powinno być layout shiftu.
Zmienia się tylko to, że 30-dniowa gwarancja satysfakcji jest hovercardem, a inne podpisy pod przyciskiem zwykłym tekstem, ale rozmiar jest ten sam.

### Elementy layoutu:

1. Ikonka (.svg) + duży tekst
   a. pricetag + za darmo
   b. zielone kółko + Jesteś w trakcie
   c. accent puchar + Kurs ukończony
   d. pricetag + {cena}
   e. lock-unlocked + Kurs należy do Ciebie

2. Mały tekst
   a. Bezpłatny dostęp na zawsze
   b. Aktywna sekcja: {nr i nazwa sekcji}
   c. Możesz wrócić do dowolnego tematu.
   d. Cena regularna po premierze: {cena regularna}
   e. O premierze poinformujemy Cię e-mailem.

3. Przycisk
   a. Rozpocznij za darmo
   b. Kontynuuj naukę
   c. Wróć do kursu
   d. Kup w przedsprzedaży
   e. Rozpocznij (przycisk nieaktywny)

4. Ikonka (z lucide) + Podpis pod przyciskiem
   a. circleplay + Od razu przejdź do nauki.
   b. circleplay + Kontynuuj od ostatnio ukończonej lekcji
   c. rotateccw + Powtarzaj materiał w dowolnym momencie.
   d. shieldcheck + 30-dniowa gwarancja satysfakcji
   e. calendarDays + Planowana premiera kursu: {data}

## Uwagi:

- Podczas sprawdzania stanu kursu powinien dalej wyświetlać się ten sam skeleton co przy ładowaniu strony z serwera.
- W landingu kursu html usuń badge "Cały kurs za darmo"
- Strona kursu ma być cały czas renderowana po stronie serwera, tylko część hero ze statusem kursu ma być renderowana po stronie klienta.
