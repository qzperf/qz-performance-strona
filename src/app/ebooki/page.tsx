import type { Metadata } from "next";
import { getProducts, getSettings } from "@/lib/store";
import { CatalogBrowser } from "@/components/catalog-browser";
import { PageHeading } from "@/components/ui";
export const metadata: Metadata = { title: "E-booki i audiobooki" };
export default async function Catalog() { const [products, settings] = await Promise.all([getProducts(), getSettings()]); return <div className="container catalog-page"><PageHeading eyebrow="BIBLIOTEKA ZDROWIA I FORMY" title={<>Wiedza, która zostaje.<br/><em>Forma, która rośnie.</em></>}><p>E-booki i audiobooki o ciele, ruchu i codziennych wyborach.<br/>Znajdź temat dla siebie i poznawaj go we własnym tempie.</p></PageHeading><CatalogBrowser products={products} settings={{ sportsPhotos: settings.sportsPhotos }}/></div>; }
