import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { Brand } from "./ui";
import type { Settings } from "@/lib/types";
export function Footer({ settings }: { settings: Settings }) {
  return <footer className="site-footer"><div className="container footer-top"><div><Brand small/><p>Więcej zrozumienia.<br/>Lepsze decyzje. Twoje zdrowie.</p></div><div><span className="footer-label">ODKRYWAJ</span><Link href="/ebooki">E-booki i audiobooki</Link><Link href="/o-mnie">O mnie</Link><Link href="/qz-performance">QZ Performance</Link></div><div><span className="footer-label">POROZMAWIAJMY</span>{settings.email && <a href={`mailto:${settings.email}`}><Mail size={15}/>{settings.email}</a>}{settings.phone && <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>}<Link href="/kontakt">Napisz wiadomość<ArrowUpRight size={16}/></Link></div><div className="footer-note"><span className="little-cross">+</span><p>Bez cudownych metod.<br/>Ze zrozumieniem ciała.</p><span>ZDROWIE BEZ ŚCIEMY</span></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Zdrowie Bez Ściemy</span><div><Link href="/prywatnosc">Prywatność</Link><Link href="/regulamin">Regulamin</Link><Link href="/admin">Panel autora<ArrowUpRight size={12}/></Link></div></div></footer>;
}
