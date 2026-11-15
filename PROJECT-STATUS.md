# Stan projektu — Zdrowie Bez Ściemy

Aktualizacja: 15 listopada 2026. Przed kolejnymi zmianami sprawdź aktualny stan kodu i usług; ten dokument jest punktem wyjścia, nie automatycznym monitoringiem.

## Strona i publikacja

- Strona: https://zdrowiebezsciemy.pl (www przekierowuje na adres bez www).
- Repozytorium: https://github.com/qzperf/qz-performance-strona, gałąź produkcyjna `main`.
- Projekt Vercel: `qz16/zdrowie-bez-sciemy`. Zmiany wysłane na `main` uruchamiają wdrożenie produkcyjne.
- Domena jest zarejestrowana w Hostingerze, który obsługuje DNS. Rekordy poczty należy zachować przy zmianach DNS.
- Lokalny folder na tym laptopie: `C:\Users\Mateusz\OneDrive\Pulpit\zdrowie-bez-sciemy`.
- Zasady pracy i publikacji są opisane w `AGENTS.md`; szczegóły uruchomienia i konfiguracji w `README.md`.

## Obecny zakres

Strona Next.js obejmuje stronę główną, katalog dziewięciu kategorii e-booków i audiobooków, O mnie, QZ Performance i Kontakt. W katalogu są także dyscypliny sportowe oraz wyzwania wytrzymałościowe. Tekst menu na większych ekranach został powiększony; wersja telefonu pozostała bez zmian.

Wersja online jest na razie podglądem: treści i publikacje są demonstracyjne, a formularze, panel autora oraz sprzedaż nie działają online. Strona ma ustawione noindex. Lokalnie istnieje panel i zapis danych; lokalne dane nie przenoszą się automatycznie na hosting.

## Do zrobienia przed pełnym uruchomieniem

- Uzupełnić właściwe dane kontaktowe, biografię, zdjęcia, ofertę oraz własne publikacje i pliki.
- Skonfigurować Supabase na potrzeby trwałego zapisu danych i plików.
- Skonfigurować pocztę, w tym powiadomienia o wiadomościach i opiniach oraz moderację opinii.
- Skonfigurować i przetestować płatności, dostarczanie plików oraz odpowiednie dokumenty i treści przed uruchomieniem sprzedaży.
- Sprawdzić działanie całych procesów w środowisku online przed ogłoszeniem pełnego startu.

Nie włączaj tych funkcji automatycznie tylko na podstawie tej listy: uzgodnij ich uruchomienie z właścicielem i sprawdź bieżącą konfigurację. Nie umieszczaj haseł, kluczy ani prywatnych danych w repozytorium. Po istotnych zmianach aktualizuj ten dokument.