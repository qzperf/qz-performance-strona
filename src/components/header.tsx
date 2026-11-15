"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { categories } from "@/lib/catalog";
import { Brand, CategoryIcon } from "./ui";
export function Header() {
  const path = usePathname(); const [mobile, setMobile] = useState(false); const [books, setBooks] = useState(false); const root = useRef<HTMLElement>(null); const previousPath = useRef(path);
  useEffect(() => { if (previousPath.current !== path) { setMobile(false); setBooks(false); previousPath.current = path; } }, [path]);
  useEffect(() => {
    const close = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) { setBooks(false); setMobile(false); } };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") { setBooks(false); setMobile(false); } };
    document.addEventListener("pointerdown", close); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, []);
  return <header className="site-header" ref={root}><div className="container header-inner"><Brand/><button className="mobile-toggle icon-button" aria-label={mobile ? "Zamknij menu" : "Otwórz menu"} aria-expanded={mobile} aria-controls="main-navigation" onClick={() => setMobile(!mobile)}>{mobile ? <X/> : <Menu/>}</button><nav id="main-navigation" className={mobile ? "nav-open" : ""} aria-label="Nawigacja główna"><Link className={path === "/o-mnie" ? "active" : ""} href="/o-mnie">O mnie</Link><div className="books-nav"><button className={path.startsWith("/ebooki") ? "nav-trigger active" : "nav-trigger"} onClick={() => setBooks(!books)} aria-expanded={books} aria-controls="books-menu">E-booki <ChevronDown size={14} className={books ? "rotated" : ""}/></button>{books && <div className="mega-menu" id="books-menu"><div className="mega-intro"><span className="eyebrow">TWOJA BIBLIOTEKA WIEDZY</span><Link href="/ebooki" onClick={() => setBooks(false)}>Wszystkie e-booki<br/>i audiobooki <ArrowUpRight size={24}/></Link><p>Wybierz temat, który jest Ci bliski.</p></div><div className="mega-categories">{categories.map(c => <Link href={`/ebooki/${c.slug}`} key={c.slug} onClick={() => setBooks(false)}><CategoryIcon name={c.icon} size={18}/>{c.title}<ArrowUpRight size={13}/></Link>)}</div></div>}</div><Link className={path === "/qz-performance" ? "active" : ""} href="/qz-performance">QZ Performance</Link><Link className={path === "/kontakt" ? "active" : ""} href="/kontakt">Kontakt</Link><Link href="/ebooki" className="button header-cta">Odkryj e-booki<ArrowUpRight size={20}/></Link></nav></div></header>;
}
