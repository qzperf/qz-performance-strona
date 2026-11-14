import type { Metadata } from "next";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import { getSettings } from "@/lib/store";
import { PageHeading } from "@/components/ui";
import { PublicForm } from "@/components/forms";
export const metadata: Metadata = { title: "Kontakt" };
export default async function Contact({ searchParams }: { searchParams: Promise<{ temat?: string }> }) {
  const [s, params] = await Promise.all([getSettings(), searchParams]);
  return <div className="container contact-page"><PageHeading eyebrow="ZACZNIJMY OD ROZMOWY" title={<>Masz pytanie?<br/><em>Jestem po drugiej stronie.</em></>}><p>O współpracy, materiałach albo Twoim pomyśle.<br/>Napisz, co Ci chodzi po głowie.</p></PageHeading><div className="contact-layout"><div className="contact-details">{s.email && <a href={`mailto:${s.email}`}><span className="contact-icon"><Mail size={22}/></span><div><span>NAPISZ DO MNIE</span><strong>{s.email}</strong></div><ArrowUpRight size={20}/></a>}{s.phone && <a href={`tel:${s.phone.replace(/\s/g, "")}`}><span className="contact-icon"><Phone size={22}/></span><div><span>ZADZWOŃ</span><strong>{s.phone}</strong></div><ArrowUpRight size={20}/></a>}{!s.email && !s.phone && <div className="contact-note"><Mail size={28}/><h3>Porozmawiajmy.</h3><p>Skorzystaj z formularza obok.<br/>Dane do bezpośredniego kontaktu<br/>pojawią się tutaj po uzupełnieniu.</p></div>}<div className="contact-note"><p className="eyebrow">QZ PERFORMANCE</p><h3>Twój pierwszy krok<br/>do świadomego treningu.</h3><p>Napisz kilka słów o sobie i swoim celu.<br/>To dobry punkt wyjścia do rozmowy.</p></div></div><div className="contact-form-card"><h2>Napisz wiadomość<span>.</span></h2><PublicForm type="contact" defaultSubject={params.temat === "QZ Performance" ? "QZ Performance" : "Współpraca online"}/></div></div></div>;
}
