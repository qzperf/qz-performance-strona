"use client";
export default function Error({ reset }: { reset: () => void }) { return <div className="container error-page"><h1>Potrzebujemy krótkiej przerwy.</h1><p>Nie udało się wczytać tej części strony. Spróbuj ponownie za chwilę.</p><button onClick={reset} className="button">Spróbuj ponownie</button></div>; }
