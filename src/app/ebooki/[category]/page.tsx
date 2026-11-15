import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/lib/catalog";
import { getProducts, getSettings } from "@/lib/store";
import { CatalogBrowser } from "@/components/catalog-browser";
import { CategoryIcon, PageHeading } from "@/components/ui";
type Props = { params: Promise<{ category: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { category } = await params; return { title: categories.find(c => c.slug === category)?.title || "Biblioteka" }; }
export default async function CategoryPage({ params }: Props) {
  const { category } = await params; const item = categories.find(c => c.slug === category); if (!item) notFound();
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  return <div className="container catalog-page"><PageHeading eyebrow="E-BOOKI I AUDIOBOOKI" title={<><span className="heading-icon"><CategoryIcon name={item.icon} size={35}/></span>{item.title}</>}><p>{item.description}</p></PageHeading><CatalogBrowser products={products} category={category} settings={{ sportsPhotos: settings.sportsPhotos }}/></div>;
}
