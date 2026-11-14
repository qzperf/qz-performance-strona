import { guard, readJson, siteUrl } from "@/lib/security";
import { getProducts, getSettings, supabase } from "@/lib/store";
import { emailReady } from "@/lib/email";
import { stripe } from "@/lib/stripe";
export async function POST(request: Request) {
  try {
    const blocked = await guard(request, "checkout", 15); if (blocked) return blocked;
    const { productId, consent } = await readJson(request); const product = (await getProducts()).find(p => p.id === productId); const settings = await getSettings();
    if (!product || product.demo) return Response.json({ error: "Ta publikacja nie jest jeszcze dostępna w sprzedaży." }, { status: 400 });
    if (!consent || consent !== true) return Response.json({ error: "Potwierdź regulamin i zgodę na dostarczenie treści cyfrowej." }, { status: 400 });
    if (!supabase() || !emailReady() || !product.filePath || !settings.terms || !settings.privacy || !process.env.STRIPE_WEBHOOK_SECRET) return Response.json({ error: "Sprzedaż jest jeszcze w przygotowaniu." }, { status: 503 });
    const { error } = await supabase()!.storage.from("publications").createSignedUrl(product.filePath, 60); if (error) return Response.json({ error: "Plik publikacji jest chwilowo niedostępny." }, { status: 503 });
    const session = await stripe().checkout.sessions.create({
      mode: "payment", locale: "pl", billing_address_collection: "required",
      line_items: [{ price_data: { currency: "pln", unit_amount: product.price, product_data: { name: product.title, description: product.subtitle } }, quantity: 1 }],
      metadata: { productId: product.id, filePath: product.filePath, digitalConsentAt: new Date().toISOString() },
      success_url: `${siteUrl()}/zamowienie?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${siteUrl()}/ebooki/publikacja/${product.slug}?anulowano=1`
    });
    return Response.json({ url: session.url });
  } catch { return Response.json({ error: "Nie udało się otworzyć płatności. Spróbuj ponownie później." }, { status: 500 }); }
}
