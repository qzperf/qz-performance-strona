import type { Metadata } from "next";
import Link from "next/link";
import { getReviews } from "@/lib/store";
import { verifyToken } from "@/lib/tokens";
import { PageHeading } from "@/components/ui";
import { ModerationActions } from "@/components/admin";
export const metadata: Metadata = { title: "Zatwierdzanie opinii", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function Moderate({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams; const id = verifyToken(token || "", "moderate"); const review = id ? (await getReviews()).find(r => r.id === id) : null;
  return <div className="container legal-page"><PageHeading eyebrow="PANEL AUTORA / OPINIE" title="Sprawdź nową opinię"/>{review ? <section className="admin-card"><div className="admin-entry-head"><div><strong>{review.name} · {review.rating}/5</strong><span>{review.email}</span></div></div><p className="admin-entry-text">{review.text}</p><ModerationActions id={review.id} token={token!}/></section> : <div className="prose"><p>Link jest nieprawidłowy lub wygasł. Zaloguj się do panelu autora, aby zatwierdzić opinię.</p><Link href="/admin" className="button">Otwórz panel autora</Link></div>}</div>;
}
