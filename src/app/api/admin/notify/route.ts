import { guard, isAdmin, readJson } from "@/lib/security";
import { getMessages, getReviews, addMessage, addReview } from "@/lib/store";
import { notifyMessage, notifyReview } from "@/lib/notifications";
export async function POST(request: Request) {
  try {
    if (!await isAdmin()) return Response.json({ error: "Zaloguj się." }, { status: 401 });
    const blocked = await guard(request, "notify", 30); if (blocked) return blocked;
    const { id, type } = await readJson(request);
    if (type === "review") { const r = (await getReviews()).find(r => r.id === id); if (!r) return Response.json({ error: "Nie znaleziono opinii." }, { status: 404 }); if (!await notifyReview(r)) throw new Error("Skonfiguruj pocztę Resend."); await addReview({ ...r, notified: true }); }
    else { const m = (await getMessages()).find(m => m.id === id); if (!m) return Response.json({ error: "Nie znaleziono wiadomości." }, { status: 404 }); if (!await notifyMessage(m)) throw new Error("Skonfiguruj pocztę Resend."); await addMessage({ ...m, notified: true }); }
    return Response.json({ message: "Powiadomienie wysłane e-mailem." });
  } catch (e) { return Response.json({ error: e instanceof Error ? e.message : "Błąd wysyłki." }, { status: 503 }); }
}
