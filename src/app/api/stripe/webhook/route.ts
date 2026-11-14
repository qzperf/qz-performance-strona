import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sendMail } from "@/lib/email";
import { escapeHtml, siteUrl } from "@/lib/security";
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET; if (!secret) return Response.json({ error: "Webhook nie jest skonfigurowany." }, { status: 503 });
  let event: Stripe.Event;
  try { event = stripe().webhooks.constructEvent(await request.text(), request.headers.get("stripe-signature") || "", secret); } catch { return Response.json({ error: "Nieprawidłowy podpis." }, { status: 400 }); }
  try {
    if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === "paid" && session.metadata?.productId) {
        const email = session.customer_details?.email; if (!email) throw new Error("Brak adresu odbiorcy.");
        const link = `${siteUrl()}/zamowienie?session_id=${encodeURIComponent(session.id)}`;
        const sent = await sendMail("Twoja publikacja — Zdrowie Bez Ściemy", `<h2>Dziękuję za zamówienie!</h2><p>Płatność została potwierdzona. Publikację pobierzesz ze swojej strony zamówienia.</p><p><a href="${escapeHtml(link)}">Przejdź do pobierania</a></p><p>Ten link daje dostęp do Twojego zakupu. Zachowaj go dla siebie.</p>`, undefined, email, `order-${session.id}`);
        if (!sent) throw new Error("Poczta nie jest skonfigurowana.");
      }
    }
    return Response.json({ received: true });
  } catch { return Response.json({ error: "Nie udało się dostarczyć zamówienia. Stripe powinien ponowić webhook." }, { status: 500 }); }
}
