import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/store";
export async function GET(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("session_id"); if (!id || !/^cs_(test_|live_)?[a-zA-Z0-9]{10,}$/.test(id)) return Response.json({ error: "Nieprawidłowe zamówienie." }, { status: 400 });
    const session = await stripe().checkout.sessions.retrieve(id);
    if (session.payment_status !== "paid" || !session.metadata?.productId || !session.metadata.filePath) return Response.json({ error: "Płatność nie została potwierdzona." }, { status: 403 });
    const db = supabase(); if (!db) throw new Error("Brak magazynu plików.");
    const { data, error } = await db.storage.from("publications").createSignedUrl(session.metadata.filePath, 120, { download: true }); if (error) throw error;
    return new Response(null, { status: 303, headers: { Location: data.signedUrl, "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" } });
  } catch { return Response.json({ error: "Nie udało się pobrać pliku. Skontaktuj się z autorem." }, { status: 503 }); }
}
