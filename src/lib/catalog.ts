import type { Category, Product, Settings } from "./types";
export const categories: Category[] = [
  { slug: "anatomia", title: "Anatomia", short: "Poznaj swoje ciało", description: "Zrozum, jak zbudowane jest ciało i jak pracuje w ruchu.", icon: "body" },
  { slug: "trening-silowy", title: "Trening siłowy", short: "Buduj siłę z głową", description: "Technika, planowanie i świadoma praca nad siłą.", icon: "dumbbell" },
  { slug: "dieta-i-suplementacja", title: "Dieta i suplementacja", short: "Odżywiaj swoją formę", description: "Jedzenie i suplementacja w codziennym życiu oraz sporcie.", icon: "leaf" },
  { slug: "sen-i-regeneracja", title: "Sen i regeneracja", short: "Odpoczynek ma znaczenie", description: "Odpoczynek jako część planu, a nie przerwa od niego.", icon: "moon" },
  { slug: "trening-motoryczny", title: "Trening motoryczny", short: "Przygotuj się do gry", description: "Przygotowanie dopasowane do wymagań Twojej dyscypliny.", icon: "activity" },
  { slug: "wady-postawy-i-mobilnosc", title: "Wady postawy i mobilność", short: "Ruszaj się swobodniej", description: "Świadomość ruchu, sprawność i praca nad zakresem ruchomości.", icon: "move" },
  { slug: "kontuzje-i-rehabilitacja", title: "Kontuzje i rehabilitacja", short: "Wracaj do aktywności", description: "Edukacja o powrocie do ruchu i współpracy ze specjalistą.", icon: "heart" },
  { slug: "glowa-i-forma", title: "Głowa i forma", short: "Zadbaj o nastawienie", description: "Nawyki, regularność i miejsce sportu w codziennym życiu.", icon: "brain" },
  { slug: "biegi-wytrzymalosciowe", title: "Biegi wytrzymałościowe", short: "Idź o krok dalej", description: "HYROX, Ironman i Runmageddon — różne wyzwania, świadome przygotowanie.", icon: "run" },
];
export const sports = [
  { slug: "koszykowka", title: "Koszykówka", detail: "Dynamika. Skoczność. Zmiana kierunku.", image: "/images/basketball.jpg" },
  { slug: "siatkowka", title: "Siatkówka", detail: "Wyskok. Stabilizacja. Reakcja.", image: "/images/volleyball.jpg" },
  { slug: "golf", title: "Golf", detail: "Rotacja. Kontrola. Precyzja.", image: "/images/golf.jpg" },
  { slug: "tenis", title: "Tenis", detail: "Szybkość. Koordynacja. Wytrzymałość.", image: "/images/tennis.jpg" },
  { slug: "windsurfing", title: "Windsurfing", detail: "Balans. Siła. Kontrola ciała.", image: "/images/windsurfing.jpg" },
  { slug: "snowboard", title: "Snowboard", detail: "Równowaga. Mobilność. Stabilizacja.", image: "/images/snowboard.jpg" },
];
export const endurance = [
  { slug: "hyrox", title: "HYROX", detail: "Bieganie spotyka trening funkcjonalny.", image: "/images/strength.jpg" },
  { slug: "ironman", title: "Ironman", detail: "Pływanie. Rower. Bieganie.", image: "/images/running.jpg" },
  { slug: "runmageddon", title: "Runmageddon", detail: "Wytrzymałość, siła i pokonywanie przeszkód.", image: "/images/trail.jpg" },
];
export const defaultSettings: Settings = {
  name: "Mateusz", email: "", phone: "", portrait: "", sportsPhotos: {},
  bio: "Sport, ruch i zdrowie są ze mną na co dzień. Zdrowie Bez Ściemy to miejsce, w którym dzielę się swoim podejściem do świadomej aktywności.",
  about: "Wierzę, że dbanie o siebie zaczyna się od zrozumienia własnego ciała. Chcę pomagać Ci łączyć wiedzę z działaniem — bez skrajności, presji i obietnic na skróty.\n\nNa tej stronie znajdziesz przestrzeń na wiedzę o treningu, regeneracji i codziennych nawykach, a także możliwość indywidualnej współpracy w QZ Performance.",
  offer: "Indywidualna współpraca online, dopasowana do Twojego celu, możliwości i rytmu dnia. Zaczynamy od rozmowy, określamy kierunek i krok po kroku budujemy plan działania.",
  offerPrice: "Wycena indywidualna", privacy: "", terms: ""
};
export const seedProducts: Product[] = [
  { id: "sila-od-podstaw", slug: "sila-od-podstaw", title: "Siła od podstaw", subtitle: "Mocne fundamenty. Świadomy trening.", description: "Przykładowa publikacja pokazująca, jak będzie wyglądać Twój katalog. Miejsce na materiał o podstawach techniki, planowaniu treningu i budowaniu regularności.", category: "trening-silowy", format: "bundle", price: 7900, color: "orange", pages: 84, duration: "2 godz. 15 min", featured: true, published: true, demo: true, filePath: "", contents: ["Podstawowe wzorce ruchowe", "Technika i dobór obciążenia", "Jak zaplanować tydzień treningowy", "Monitorowanie postępów"] },
  { id: "regeneracja-to-trening", slug: "regeneracja-to-trening", title: "Regeneracja to też trening", subtitle: "Daj swojemu ciału czas na więcej.", description: "Przykładowy temat do uzupełnienia Twoją publikacją o śnie, odpoczynku i organizacji tygodnia aktywności.", category: "sen-i-regeneracja", format: "bundle", price: 5900, color: "green", pages: 62, duration: "1 godz. 40 min", featured: true, published: true, demo: true, filePath: "", contents: ["Miejsce regeneracji w planie", "Rytm dnia i sen", "Równowaga wysiłku i odpoczynku", "Prosty dziennik regeneracji"] },
  { id: "jedz-swiadomie", slug: "jedz-swiadomie", title: "Jedz świadomie", subtitle: "Mniej zasad. Więcej zrozumienia.", description: "Przykładowa publikacja do zastąpienia autorskim materiałem o nawykach żywieniowych i świadomych wyborach.", category: "dieta-i-suplementacja", format: "ebook", price: 4900, color: "cream", pages: 72, duration: "", featured: true, published: true, demo: true, filePath: "", contents: ["Podstawy codziennych wyborów", "Planowanie posiłków", "Czytanie etykiet", "Pytania o suplementację"] },
  { id: "sprawne-cialo", slug: "sprawne-cialo", title: "Sprawne ciało na co dzień", subtitle: "Więcej swobody w każdym ruchu.", description: "Miejsce na Twój autorski przewodnik po świadomym ruchu i mobilności.", category: "wady-postawy-i-mobilnosc", format: "bundle", price: 6900, color: "blue", pages: 96, duration: "2 godz.", featured: true, published: true, demo: true, filePath: "", contents: ["Obserwacja własnego ruchu", "Zakresy ruchomości", "Praca nad regularnością", "Kiedy skonsultować się ze specjalistą"] },
  { id: "glowa-w-grze", slug: "glowa-w-grze", title: "Głowa w grze", subtitle: "Twój rytm. Twoja konsekwencja.", description: "Przykładowy audiobook o budowaniu nawyków i miejscu sportu w codzienności. Do zastąpienia autorskim nagraniem.", category: "glowa-i-forma", format: "audio", price: 4900, color: "green", pages: 0, duration: "1 godz. 30 min", featured: false, published: true, demo: true, filePath: "", contents: ["Cel, który ma dla Ciebie sens", "Od planu do regularności", "Gdy motywacja spada", "Sport bez niepotrzebnej presji"] },
  { id: "pierwszy-hyrox", slug: "pierwszy-hyrox", title: "Kierunek: HYROX", subtitle: "Przygotuj się na nowe wyzwanie.", description: "Przykładowa pozycja w sekcji biegów wytrzymałościowych. Miejsce na autorski materiał o przygotowaniu do startu.", category: "biegi-wytrzymalosciowe", topic: "hyrox", format: "bundle", price: 8900, color: "orange", pages: 110, duration: "2 godz. 40 min", featured: false, published: true, demo: true, filePath: "", contents: ["Poznaj wymagania wydarzenia", "Łączenie biegania i siły", "Organizacja przygotowań", "Tydzień przed startem"] },
];
export const formatLabel = (format: Product["format"]) => format === "bundle" ? "E-book + audiobook" : format === "audio" ? "Audiobook" : "E-book";
export const money = (value: number) => new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(value / 100);
