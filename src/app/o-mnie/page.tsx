import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Compass, Heart, MoveUpRight } from "lucide-react";
import { getSettings } from "@/lib/store";
import { PageHeading } from "@/components/ui";
export const metadata: Metadata = { title: "O mnie" };
export default async function About() {
  const s = await getSettings();
  return <div className="container"><PageHeading eyebrow="POZNAJMY SIĘ" title={<>Cześć, jestem {s.name}.<br/><em>Ruch to mój kierunek.</em></>}/><section className="about-page-layout"><div className="portrait-panel">{s.portrait ? <img src={s.portrait} alt={s.name}/> : <div className="portrait-placeholder"><span>{s.name.charAt(0)}<em>.</em></span><p>ZDROWIE BEZ ŚCIEMY</p><MoveUpRight size={68} strokeWidth={.8}/></div>}</div><div className="about-body"><p className="lead-text">{s.bio}</p><div className="prose">{s.about.split("\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div><Link href="/kontakt" className="button">Porozmawiajmy<ArrowUpRight size={18}/></Link></div></section><section className="section"><p className="eyebrow"><span/>MOJE PODEJŚCIE</p><h2>Dobry kierunek.<br/><span className="muted-heading">Solidne podstawy.</span></h2><div className="values-grid">{[{ Icon: Compass, title: "Zrozumienie", text: "Chcę, żebyś rozumiał/a, po co coś robisz. Wiedza pomaga podejmować własne, świadome decyzje." }, { Icon: Heart, title: "Równowaga", text: "Sport i dbanie o siebie mają pasować do Twojego życia. Jest w nim miejsce na wysiłek i na odpoczynek." }, { Icon: MoveUpRight, title: "Działanie", text: "Liczy się kierunek i regularność. Małe kroki są dobrym początkiem pracy nad sprawnością." }].map(v => <div key={v.title}><v.Icon size={27} strokeWidth={1.4}/><h3>{v.title}</h3><p>{v.text}</p></div>)}</div></section></div>;
}
