import { randomUUID } from "node:crypto";
import { reviewSchema } from "@/lib/validation";
import { guard, readJson } from "@/lib/security";
import { addReview } from "@/lib/store";
import { notifyReview } from "@/lib/notifications";
export async function POST(request: Request) {
  try {
    const blocked = await guard(request, "review"); if (blocked) return blocked;
    const parsed = reviewSchema.safeParse(await readJson(request));
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const { name, email, text, rating } = parsed.data;
    const review = { id: randomUUID(), name, email, text, rating, createdAt: new Date().toISOString(), status: "pending" as const, notified: false };
    await addReview(review);
    try { review.notified = await notifyReview(review); if (review.notified) await addReview(review); } catch { /* Zgłoszenie pozostaje w panelu; możliwa ponowna wysyłka. */ }
    return Response.json({ message: "Dziękuję! Opinia czeka na sprawdzenie. Pojawi się na stronie po zatwierdzeniu.", notified: review.notified }, { status: 201 });
  } catch { return Response.json({ error: "Nie udało się zapisać opinii. Spróbuj ponownie za chwilę." }, { status: 500 }); }
}
