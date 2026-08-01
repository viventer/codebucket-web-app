Tagi semantyczne to takie, które mają konkretne znaczenie. Ich nazwa informuje przeglądarkę, wyszukiwarkę i programistę o roli elementu na stronie – na przykład o tym, która część odpowiada za nawigację, gdzie znajduje się nagłówek, a gdzie główna zawartość.

---

Znacznik header służy do oznaczania nagłówka strony lub sekcji. Możemy umieścić go nie tylko na górze strony, ale również np. nad artykułem.

Odwrotnością header'a jest oczywiście footer, który znajduje się na dole tej strony i pod artykułem.

Wewnątrz headera często umieszczamy znacznik nav, czyli nawigację.
Podobnie jak header i footer, nav również może występować w wielu miejscach. Oprócz głównej tutaj znajduje się również nawigacja po artykule.

Artykuł z kolei to pewien fragment strony, który nie potrzebuje żadnego kontekstu.
Możemy go wydrukować, powiesić na ścianie w salonie i nadal będzie w pełni zrozumiały.

Tym właśnie różni się od sekcji.
Sekcja również grupuje powiązaną ze sobą zawartość, jednak gdy wyodrębnimy ją ze strony - może stracić swoje znaczenie.

Każda podstrona ma również główną treść, którą umieszczamy w tagu main.
Gdy przechodzisz pomiędzy kolejnymi artykułami nie przeglądasz za każdym razem nagłówka i nie sprawdzasz co znajduje się w nawigacji. Zamiast tego od razu przechodzisz do treści artykułu, nie zwracając uwagi na całą resztę strony.

Pamiętaj, że tag main w odróżnieniu od innych znaczników semantycznych może występować na stronie tylko raz. Tylko jeden fragment może być najważniejszy.

Z kolei jakieś poboczne informacje, które mogą zostać pominięte - umieść w tagach aside. Np. ta nawigacja. Nie jest niezbędna do pełnego zrozumienia treści artykułu.

---

Wszystkie wymienione do tej pory tagi semantyczne służą do grupowania innych elementów i określania struktury strony. Jednak pojedyncze elementy, poznane w poprzednich częściach kursu, również zwykle mają swoje znaczenie.

Na przykład znacznik h1 oznacza główny nagłówek strony lub artykułu. Z kolei podtytuły, które dotyczą mniejszej części zawartości, umieszczamy w tagach h2, h3 i kolejnych. Im większa cyfra, tym nagłówek jest mniej ogólny.

Podobnie takie tagi jak img, form i button są semantyczne. Przeglądarka widząc tag img, wie, że oznacza on zdjęcie, nie musi się niczego domyślać.

Innym, nieco rzadziej używanym tagiem semantycznym jest strong. W nim umieszczamy istotne fragmenty tekstu. Przeglądarka domyślnie wyświetli je pogrubione.

Pamiętaj jednak, że nie wszystkie tagi, które wpływają na wygląd elementu mają konkretne znaczenie.
Takie tagi jak b, u czy i również zmieniają styl tekstu, jednak nie mają znaczenia dla przeglądarki. W większości przypadków ich rolę przejmuje CSS.

---

Możesz się zastanawiać, dlaczego strona musi być zrozumiała dla wyszukiwarki. Przecież tworzysz ją dla użytkowników.

Problem jest taki, że gdy google nie zrozumie twojej strony, to mało kto na nią trafi. Wyszukiwarka, żeby pokazać twoją stronę wysoko w wynikach wyszukiwania, musi wiedzieć, że odpowiada na jakieś pytanie użytkownika.

Oprócz tego dzięki tagom semantycznym kod jest bardziej czytelny dla programisty.

Nie możemy też zapominać o osobach korzystających z czytników ekranu dla których tagi semantyczne są niezbędne.

---

Z czasem, gdy już poznasz css, będziesz potrzebował grupować w html również te elementy, które nie mają wspólnego znaczenia.

Np. tutaj na jednym pasku jest informacja na jakiej podstronie się znajdujesz przycisk do zmiany motywu i języka. Nie wstawimy ich do jednej sekcji czy tymbardziej artykułu, bo nie mają ze sobą nic wspólnego.
Zamiast tego do ich oddzielenia od reszty strony skorzystamy z div'a, czyli dosłownie rozdzielacza. Nie jest on znacznikiem semantycznym, czyli nie opisuje roli elementu na stronie.
Korzystamy z niego tylko, żeby ułatwić sobie stylowanie jakiegoś elementu i na tym jego rola się kończy.

Podobną funkcję pełni znacznik span, który wykorzystujemy najczęściej do zmiany wyglądu jakiegoś fragmentu tekstu.

Dokładną różnicę pomiędzy tymi dwoma znacznikami poznasz w interaktywnym kursie CSS dostępnym w przedsprzedaży na codebucket.pl.

Znajdziesz tam również darmowy kurs HTML, którego częścią jest ten film.
Jeśli nauczyłeś się z niego czegoś nowego - zostaw łapkę w górę i suba, żeby dowiedzieć się jeszcze więcej.
