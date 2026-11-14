import Link from "next/link";
import { Activity, ArrowDown, ArrowUpRight, AudioLines, BookOpen, Brain, Dumbbell, HeartPulse, Leaf, Moon, Move, PersonStanding, Footprints } from "lucide-react";
import { formatLabel, money } from "@/lib/catalog";
import type { Product } from "@/lib/types";
export function Brand({ small = false }: { small?: boolean }) {
  return <Link href="/" className={`brand ${small ? "brand-small" : ""}`} aria-label="Zdrowie Bez Ściemy — strona główna"><svg viewBox="0 0 48 54" fill="none" aria-hidden="true"><path d="M24 3 44 11v15c0 12-11 21-20 25C15 47 4 38 4 26V11L24 3Z" stroke="currentColor" strokeWidth="2"/><path d="M11 25c14-1 17 7 14 19-10-1-15-8-14-19Z" fill="#558d72"/><path d="M37 18c-12 1-19 10-15 23 11-1 16-10 15-23Z" fill="#d3e5d4"/><path d="m15 30 9 12 9-18" stroke="#0d1b2a" strokeWidth="1.8"/><circle cx="24" cy="15" r="4" fill="#f48a47"/></svg><span>Zdrowie<span>Bez Ściemy<span className="brand-dot">.</span></span></span></Link>;
}
export function CategoryIcon({ name, size = 25 }: { name: string; size?: number }) {
  const Icon = ({ body: PersonStanding, dumbbell: Dumbbell, leaf: Leaf, moon: Moon, activity: Activity, move: Move, heart: HeartPulse, brain: Brain, run: Footprints } as Record<string, typeof Activity>)[name] || Activity;
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true"/>;
}
export function ArrowLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return <Link className={`arrow-link ${className}`} href={href}>{children}<ArrowUpRight size={18}/></Link>;
}
export function SectionIntro({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return <div className="section-intro"><div><p className="eyebrow"><span/>{eyebrow}</p><h2>{title}</h2></div>{children}</div>;
}
export function BookCover({ product, large = false }: { product: Product; large?: boolean }) {
  return <div className={`book-cover cover-${product.color} ${large ? "book-large" : ""}`} aria-hidden="true"><div className="book-spine"/><div className="cover-brand">ZDROWIE<br/>BEZ ŚCIEMY<span>+</span></div><div className="cover-orbit orbit-one"/><div className="cover-orbit orbit-two"/><div className="cover-orbit orbit-three"/><div className="cover-number">{({ orange: "01", green: "02", cream: "03", blue: "04" })[product.color]}</div><div className="cover-type">{product.title}</div><div className="cover-subtitle">{product.subtitle}</div><div className="cover-bottom"><span>WIEDZA W PRAKTYCE</span><ArrowUpRight size={24}/></div></div>;
}
export function ProductCard({ product }: { product: Product }) {
  return <Link href={`/ebooki/publikacja/${product.slug}`} className="product-card"><div className={`product-art art-${product.color}`}><div className="product-tag">{product.format === "ebook" ? <BookOpen size={13}/> : <AudioLines size={14}/>} {formatLabel(product.format)}</div><BookCover product={product}/><span className="product-arrow"><ArrowUpRight size={20}/></span></div><div className="product-meta"><span>{product.demo ? "PRZYKŁADOWA PUBLIKACJA" : "AUTORSKA PUBLIKACJA"}</span><span>{money(product.price)}</span></div><h3>{product.title}</h3><p>{product.subtitle}</p></Link>;
}
export function PageHeading({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return <div className="page-heading"><p className="eyebrow"><span/>{eyebrow}</p><h1>{title}</h1>{children && <div className="page-description">{children}</div>}</div>;
}
