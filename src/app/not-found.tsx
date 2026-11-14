import Link from "next/link";
export default function NotFound() { return <div className="container error-page"><p className="eyebrow">404 / ZMIEŃMY KIERUNEK</p><h1>Tutaj ścieżka się kończy.</h1><p>Wróć do biblioteki i znajdź coś dla siebie.</p><Link href="/ebooki" className="button">Przejdź do biblioteki ↗</Link></div>; }
