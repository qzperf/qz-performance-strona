import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Download } from "lucide-react";
import { stripe } from "@/lib/stripe";
import { PageHeading } from "@/components/ui";
export const metadata: Metadata = { title: "Twoje zamówienie", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function Order({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams; let paid = false; let pending = false;
  if (session_id && /^cs_(test_|live_)?[a-zA-Z0-9]{10,}$/.test(session_id)) { try { const s = await stripe().checkout.sessions.retrieve(session_id); paid = s.payment_status === "paid" && !!s.metadata?.productId; pending = !paid; } catch { /* Nie ujawniaj danych zamówienia. */ } }
  return <div className="container legal-page"><PageHeading eyebrow="TWOJA BIBLIOTEKA ROŚNIE" title={paid ? "Dziękuję za zakup!" : pending ? "Czekamy na potwierdzenie płatności" : "Sprawdź link do zamówienia"}/>{paid ? <div className="order-ready"><CheckCircle2 size={40}/><p>Płatność została potwierdzona. Pobierz swoją publikację poniżej.<br/>Link do zamówienia otrzymasz również e-mailem.</p><a href={`/api/download?session_id=${encodeURIComponent(session_id!)}`} className="button">Pobierz publikację<Download size={18}/></a></div> : <div className="prose"><p>{pending ? "Jeśli płatność jest w trakcie przetwarzania, odśwież tę stronę za chwilę. Dostęp do publikacji pojawi się po jej potwierdzeniu." : "Otwórz pełny link ze swojego potwierdzenia zamówienia. Jeśli potrzebujesz pomocy, napisz przez formularz kontaktowy."}</p><Link href="/kontakt" className="arrow-link">Przejdź do kontaktu ↗</Link></div>}</div>;
}
