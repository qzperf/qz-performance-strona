import type { Metadata } from "next";
import { AdminLogin, AdminPanel } from "@/components/admin";
import { isAdmin } from "@/lib/security";
import { getMessages, getProducts, getReviews, getSettings } from "@/lib/store";
import { emailReady } from "@/lib/email";
export const metadata: Metadata = { title: "Panel autora", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function Admin() {
  if (!await isAdmin()) return <AdminLogin local={!process.env.VERCEL}/>;
  const [settings, products, reviews, messages] = await Promise.all([getSettings(), getProducts(true), getReviews(), getMessages()]);
  return <AdminPanel settings={settings} products={products} reviews={reviews} messages={messages} configuration={{ storage: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY), email: emailReady(), stripe: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET), local: !process.env.VERCEL }}/>;
}
