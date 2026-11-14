# Zdrowie Bez Ściemy

Aplikacja Next.js (App Router), React i TypeScript. Granatowy motyw, biała typografia, ciemna zieleń i pomarańczowe akcenty. Projekt jest przygotowany pod Vercel.

## Uruchomienie na tym laptopie

1. Otwórz `URUCHOM.cmd`. Uruchamia serwer w tle i otwiera stronę w przeglądarce.
2. Strona: <http://localhost:3000>.
3. Panel autora: <http://localhost:3000/admin>. Prywatne hasło znajduje się w `DOSTEP-DO-PANELU.txt`.
4. Zatrzymanie serwera uruchomionego skrótem: `ZATRZYMAJ.cmd`.

Wymagany Node.js 22 lub nowszy. Skrypt potrafi użyć Node.js dostarczonego z obecną instalacją Codex. Na innym komputerze zainstaluj Node.js LTS z <https://nodejs.org>, a następnie:

```sh
npm ci
npm run dev
```

Jeśli strona jest już uruchomiona przez Codex, nie trzeba uruchamiać jej ponownie. Port 3000 służy wyłącznie tej aplikacji.

## Co działa lokalnie

- Strona główna z przewijanymi publikacjami i opiniami (po zatwierdzeniu).
- Pełna nawigacja, dziewięć kategorii e-booków i audiobooków.
- Wyszukiwanie, filtry formatu, sortowanie cen i strony publikacji.
- Koszykówka, siatkówka, golf, tenis, windsurfing i snowboard; osobno HYROX, Ironman i Runmageddon.
- Podstrony „O mnie”, QZ Performance, Kontakt, prywatność i regulamin.
- Formularze z walidacją, zgodą i ograniczeniem liczby zgłoszeń.
- Trwały zapis lokalny do `data/store.json`: wiadomości, opinie, publikacje i treści.
- Zabezpieczony hasłem panel: moderacja, skrzynka wiadomości, edycja treści, dodawanie publikacji i wgrywanie plików oraz zdjęć.
- Każda nowa opinia ma status oczekujący. Akceptacja publikuje ją na stronie, odrzucenie ukrywa.

Lokalne pliki są prywatne na tym laptopie. Zrób kopię katalogu `data/`, aby zachować edycje, zdjęcia i zgłoszenia. Nie umieszczaj go w publicznym repozytorium.

## Co należy uzupełnić

Nie podano docelowego e-maila, telefonu, autorskich zdjęć, kwalifikacji, cennika ani plików publikacji. Wpisz je w panelu autora. Teksty biografii są propozycją redakcyjną do akceptacji. Obrazy sportowe są poglądowe, a tytuły i ceny publikacji demonstracyjne. Nie ma wymyślonych opinii klientów.

Przykładowych produktów nie da się kupić. Rzeczywista sprzedaż włącza się dla autorskiej publikacji po dodaniu pliku i konfiguracji usług oraz docelowych dokumentów. Aplikacja nie udaje wysłania e-maila: bez konfiguracji wiadomość trafia do panelu, a formularz wyświetla tę informację.

## Vercel — wdrożenie

1. Utwórz prywatne repozytorium GitHub z kodem. Nie dodawaj `.env.local`, `DOSTEP-DO-PANELU.txt`, `data/`, `node_modules/` ani `.next/`.
2. Załóż projekt Supabase. Uruchom plik `supabase/schema.sql` w SQL Editor. Tworzy tabele z RLS, atomowe ograniczanie zgłoszeń, prywatny magazyn `publications` i publiczny `photos`.
3. W Resend zweryfikuj swoją domenę nadawcy. Ustaw `MAIL_FROM` np. `Zdrowie Bez Ściemy <kontakt@twoja-domena.pl>` oraz swój adres w `CONTACT_EMAIL`.
4. W Stripe skonfiguruj konto i webhook `https://twoja-domena.pl/api/stripe/webhook` dla zdarzeń `checkout.session.completed` i `checkout.session.async_payment_succeeded`. Zacznij od kluczy testowych. Dodaj otrzymany sekret podpisu webhooka.
5. Zaimportuj repozytorium do Vercel. Framework: Next.js. Node.js: 24.x. Build: `npm run build`. Plik `vercel.json` jest już w projekcie.
6. W Environment Variables Vercel ustaw wszystkie zmienne z `.env.example`; URL musi wskazywać docelowy adres HTTPS. `ADMIN_PASSWORD` i `SESSION_SECRET` powinny być różnymi, losowymi wartościami (min. 32 znaki). Nigdy nie dodawaj prefiksu `NEXT_PUBLIC_` do kluczy prywatnych.
7. Wdróż, zaloguj się do panelu na nowej domenie i uzupełnij treści, kontakt, regulamin i informację o prywatności. Zastąp przykładowe publikacje autorskimi.
8. Sprawdź formularze, powiadomienie o nowej opinii, link moderacji, testową płatność i pobieranie pliku. Dopiero potem podmień klucze Stripe na produkcyjne.

Lokalne dane i pliki nie przenoszą się automatycznie do Supabase. Możesz uzupełnić panel po wdrożeniu lub użyć `scripts/migrate-local.ts` (opis poniżej). Vercel nie zapisuje danych aplikacji do lokalnego systemu plików; przy braku Supabase zapis na Vercel kończy się błędem zamiast pozornego sukcesu.

## Migracja danych lokalnych

Wpisz `SUPABASE_URL` i `SUPABASE_SERVICE_ROLE_KEY` w `.env.local` po utworzeniu schematu. Zatrzymaj serwer i uruchom:

```sh
npx tsx --env-file=.env.local scripts/migrate-local.ts
```

Skrypt kopiuje lokalne ustawienia, publikacje, wiadomości, opinie i pliki do Twojego Supabase. Jest przeznaczony do jednorazowej migracji przed startem. Zachowuje identyfikatory; powtórne wykonanie może zastąpić odpowiadające im wpisy z kopii lokalnej. Nie usuwa lokalnych danych.

## Płatności i pliki

Cena jest ustalana na serwerze. Zakup wymaga opublikowanej, niedemonstracyjnej publikacji i pliku w prywatnym magazynie. Zestaw e-book + audiobook jest jednym plikiem ZIP. Stripe obsługuje stronę płatności; aplikacja nie przechowuje numerów kart. Potwierdzenie sprawdza status płatności na serwerze. Webhook z podpisem wysyła e-mail z linkiem do zamówienia. Pobieranie generuje krótki, podpisany URL Supabase dopiero po potwierdzeniu opłacenia sesji. Link do zamówienia jest prywatnym uprawnieniem do pobrania — nie udostępniaj go.

Duże pliki są przesyłane bezpośrednio z panelu do Supabase podpisanym URL, z pominięciem limitu treści Vercel Functions. Zdjęcia do 10 MB, publikacje do 500 MB (ustaw plan i limit pojedynczego pliku w Supabase; darmowy plan może wymagać mniejszych plików).

## Kontrola jakości

```sh
npm run typecheck
npm test
npm run build
```

Testy sprawdzają podpisy i czas ważności tokenów, rozdzielenie uprawnień, walidację opinii oraz ścieżek prywatnych plików. Przepływ moderacji i zapisu formularzy został dodatkowo sprawdzony lokalnie przez HTTP. Integracje z Resend, Supabase i Stripe wymagają sprawdzenia na Twoich kontach po dodaniu kluczy.

## Dokumentacja usług

- Next.js: <https://nextjs.org/docs/app/getting-started/installation>
- Vercel Functions i system plików: <https://vercel.com/docs/functions/runtimes>
- Stripe i dostarczanie zakupów: <https://docs.stripe.com/checkout/fulfillment>
- Supabase i podpisane linki: <https://supabase.com/docs/reference/javascript/storage-from-createsignedurl>
- Resend: <https://resend.com/docs/api-reference/emails/send-email>

Font Manrope jest lokalny (licencja SIL Open Font License w `public/fonts/OFL.txt`). Źródła zdjęć opisano w `ASSETS.md`.
