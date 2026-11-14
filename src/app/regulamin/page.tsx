import type { Metadata } from "next";
import { getSettings } from "@/lib/store";
import { PageHeading } from "@/components/ui";
export const metadata: Metadata = { title: "Regulamin" };
export default async function Terms() { const s = await getSettings(); return <div className="container legal-page"><PageHeading eyebrow="PRZEJRZYSTE ZASADY" title="Regulamin"/><div className="prose">{s.terms ? s.terms.split("\n").map((p, i) => <p key={i}>{p}</p>) : <><p>Biblioteka jest obecnie w wersji demonstracyjnej. Przykładowe publikacje nie są przedmiotem sprzedaży i nie można ich kupić.</p><p>Przed uruchomieniem sprzedaży właściciel uzupełni regulamin, w tym dane sprzedawcy, opis świadczenia, zasady zamawiania i dostarczania treści cyfrowych, płatności, reklamacji oraz prawa konsumenta.</p><p>Materiały na stronie mają charakter edukacyjny. Zakres współpracy QZ Performance jest ustalany indywidualnie przed jej rozpoczęciem.</p></>}</div></div>; }
