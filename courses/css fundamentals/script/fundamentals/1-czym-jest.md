CSS, czyli kaskadowe arkusze stylów to język używany do określania wyglądu stron internetowych.
W tym kursie od podstaw dowiesz się o nim wszystkiego czego potrzebujesz do stylowania swoich pierwszych projektów.

W html'u tworzymy strukturę strony, dodajemy elementy, które mają się na niej
znaleźć, a w CSS za pomocą odpowiednich właściwości dostosowujemy
ich wygląd np. kolor, rozmiar, czy ułożenie.

Dlatego przed poznaniem css'a wymagana jest znajomość podstaw HTML, jeśli ich nie znasz to ukończ darmowy kurs tego języka dostępny na codebucket.pl, link w opisie.

---

Na początek tak jak zwykle utwórz plik index.html, a w nim wstaw templatkę.
Wewnątrz body wstaw paragraf, napisz lorem, kliknij tab i skopiuj taki paragraf kilka razy.

Żeby przyśpieszyć sobie pracę możesz zainstalować rozszerzenia live server i prettier. Pierwsze odświeża podgląd strony po zapisaniu pliku, a drugie odpowiada za formatowanie kodu.

Jak już zainstalujesz live server kliknij "go live" w prawym dolnym rogu.

---

Pierwszym, najprostszym sposobem na zmianę wyglądu elementu jest skorzystanie z atrybutu style.
Dodajmy go do paragrafu i zmieńmy kolor tekstu na czerwony zapisując color: red;
Color to wcześniej wspomniana właściwość css, a red jej wartość.
Kolejne właściwości oddzielamy średnikami, możemy dodać
jeszcze font-size: 64px zmieniając rozmiar czcionki.
Piksele są podstawową jednostką w css'ie, określamy w nich wartości
wszystkich właściwości związanych z wymiarami, a przynajmniej na
tym etapie nauki.

Dodawanie stylów w taki sposób jest jednak niewygodne, dlatego usuńmy ten atrybut i skorzystajmy z drugiej opcji - tagów style.
Umieszczamy je w headzie.
W nich najpierw określamy jaki element chcemy wystylować, np. wszystkie paragrafy.
Potem stawiamy nawiasy klamrowe a w nich pod sobą umieszczamy
kolejne właściwości i ich wartości, podobnie jak robiliśmy
to w atrybucie style.
Np. ustawmy kolor czcionki na biały i rozmiar na 32px.

Teraz, żeby móc zobaczyć tekst ustawmy kolor tła, czyli background-color na czarny.

W praktyce najczęściej ustawiamy kolor tła dla całej strony.
Aby to zrobić zapiszmy poniżej nazwę tagu body, nawiasy i przenieśmy tu właściwość z paragrafu.

---

To co zapisujemy przed nawiasami klamrowymi nazywamy selektorem.
A selektor wraz z właściwościami tworzą regułę.

Selektorem może być po prostu nazwa tagu, taka jak p, czy body.
Tagi jako selektory mają sens jednak tylko jeśli chcemy aby wszystkie
elementy o danym tagu wyglądały tak samo.

Problem pojawia się gdy np. chcielibyśmy wystylować tylko pierwszy paragraf.
W takim przypadku możemy nadać mu atrybut id, ustawmy go na first-paragraph.
Id nie mogą zawierać spacji dlatego pomiędzy słowami wstawiłem myślnik, możesz też kolejne słowa zaczynać od wielkiej litery.

Teraz żeby w css stworzyć selektor do tego id zapisujemy # i po nim samo id, czyli first-paragraph.
Zmieńmy jego kolor na różowy.

Zamiast id możemy używać też klas.
Różnica jest taka, że id, czyli identyfikator możemy przypisać tylko
do jednego elementu, bo jednoznacznie identyfikuje on konkretny element,
a klasę możemy do wielu.
Klasę jak możecie się domyślać nadajemy atrybutem class, np. dwóm kolejnym paragrapfom dodajmy klasę red-paragraphs i ustawmy im kolor czcionki na czerwony.

Elementy mogą mieć też kilka klas na raz. Do klasy red-paragraphs dopiszmy gray-background i dla tej klasy zmieńmy kolor tła.

Teraz zróbmy szybki eksperyment. Dodajmy do czerwonych paragrafów klase green-paragraphs i ustawmy dla niej zielony kolor czcionki.
Jak widzicie kolor czcionki uległ zmianie. Jest to związane z wcześniej wspomnianą kaskadowością arkuszy stylów.
Jedną z cech kaskadowości jest to, że właściwości znajdujące się niżej
w pliku nadpisują te wyższe.
Jak sobie klikniemy f12, tym takim narzędziem ze strzałką najedziemy na paragraf
i go klikniemy.
To w zakładce styles zobaczymy, że właściwość color pochodząca z klasy
red-paragraphs, czyli tej wyższej jest przekreślona, co oznacza, że
zostałą nadpisana.

Jednak inny skutek będzie miało dodanie klasy green-paragraphs do pierwszego paragrafu. Pomimo tego, że reguła dla tej klasy jest niżej niż dla id first-paragraph, to i tak paragraf pozostał różowy.
Wniosek jest prosty - klasy mają niższy priorytet niż id. Można to łatwo zapamiętać tak, że id są bardziej dokładne, dotyczą jednego, konkretnego elementu, dlatego też są ważniejsze. Z kolei najmniejszy priorytet mają właściwości określone dla tagów, bo są najbardziej ogólne.

Na priorytet właściwości wpływa też sposób dodawania css, ale jeśli nie będziesz korzystał ze stylów inline, to nie będzie to dla ciebie problemem.
