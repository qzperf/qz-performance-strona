import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getSettings } from "@/lib/store";
import { isHostedPreview } from "@/lib/availability";
import "./globals.css";
const manrope = localFont({ src: "../../public/fonts/Manrope.ttf", variable: "--font-manrope", display: "swap" });
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { default: "Zdrowie Bez Ściemy — wiedza, ruch i świadome zdrowie", template: "%s | Zdrowie Bez Ściemy" },
  description: "Zrozum swoje ciało. Odkrywaj e-booki i audiobooki o treningu, regeneracji i zdrowych nawykach. Poznaj QZ Performance i współpracę online.",
  applicationName: "Zdrowie Bez Ściemy", robots: { index: !isHostedPreview() && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production"), follow: true }
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return <html lang="pl" className={manrope.variable}><body><a className="skip-link" href="#main">Przejdź do treści</a><Header/><main id="main">{children}</main><Footer settings={settings}/></body></html>;
}
